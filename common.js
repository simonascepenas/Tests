// Shared helpers for the quiz pages.
(function () {
  var C = window.QUIZ_CONFIG || {};
  window.QZ = {
    config: C,
    letters: "ABCDEFGH",
    configProblem: function () {
      if (!C.supabaseUrl || !/^https?:\/\//.test(C.supabaseUrl)) return "The Supabase project URL is missing in config.js.";
      if (!C.publishableKey || /^PASTE/.test(C.publishableKey)) return "The publishable key is missing. Paste it into config.js.";
      if (/^sb_secret_/.test(C.publishableKey)) return "config.js contains the secret key. Replace it with the publishable key (sb_publishable_…) and create a new secret key in Supabase.";
      if (!C.quizId) return "The quiz id is missing in config.js.";
      return "";
    },
    client: function (persist) {
      return window.supabase.createClient(C.supabaseUrl, C.publishableKey, {
        auth: { persistSession: !!persist, autoRefreshToken: !!persist, detectSessionInUrl: false }
      });
    },
    esc: function (s) { var d = document.createElement("div"); d.textContent = s == null ? "" : String(s); return d.innerHTML; },
    reachMsg: "Couldn’t reach the quiz database. Check the internet connection. If the Supabase project was idle for a week, restore it in the Supabase dashboard.",
    store: {
      get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
      set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
    },
    csv: function (questions, rows) {
      var head = ["name", "submitted"];
      questions.forEach(function (_, i) { head.push("Q" + (i + 1) + " answer", "Q" + (i + 1) + " correct"); });
      head.push("score", "out_of");
      var lines = [head];
      rows.forEach(function (r) {
        var line = [r.name, r.submitted];
        r.answers.forEach(function (a, i) { line.push(a, r.correct[i] ? "yes" : "no"); });
        line.push(r.score, questions.length);
        lines.push(line);
      });
      var text = lines.map(function (l) {
        return l.map(function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(",");
      }).join("\r\n");
      var blob = new Blob(["\ufeff" + text], { type: "text/csv;charset=utf-8" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = (C.quizId || "quiz") + "_results.csv";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
    },
    // One row per student for the current class: letters, right/wrong, duplicate-name count.
    studentRows: function (questions, responses) {
      var L = this.letters, counts = {};
      responses.forEach(function (r) { var k = r.name.toLowerCase(); counts[k] = (counts[k] || 0) + 1; });
      return responses.slice().sort(function (a, b) {
        return a.name.localeCompare(b.name, undefined, { sensitivity: "base" }) || (a.created_at < b.created_at ? -1 : 1);
      }).map(function (r) {
        var d = new Date(r.created_at);
        var pad = function (n) { return (n < 10 ? "0" : "") + n; };
        return {
          name: r.name,
          submitted: d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + pad(d.getHours()) + ":" + pad(d.getMinutes()),
          answers: r.answers.map(function (a) { return L[a]; }),
          correct: r.answers.map(function (a, i) { return questions[i] && a === questions[i].answer; }),
          score: r.score,
          same_name: counts[r.name.toLowerCase()]
        };
      });
    }
  };
})();
