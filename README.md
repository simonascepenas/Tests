# Live classroom quiz (Supabase + GitHub Pages)

Students scan a QR code and answer on their phones, on any Wi-Fi or mobile data. Answers are graded by the database, students see their result straight away, and you watch the results come in on the instructor screen.

**What's in this folder**

- `setup.sql`: the database setup, including the questions **and answer key**. It has already been run on your project; keep it for editing questions later. **Do not upload it to GitHub.**
- `site/`: the web pages. Upload everything in this folder to GitHub. It contains no answers.

Your project: `https://gvquqkitqbkkmwdgbahc.supabase.co`

---

## One-time setup

**Already done in your Supabase project** (`https://gvquqkitqbkkmwdgbahc.supabase.co`, EU region):

- the database tables, access rules and the three Hoffman questions (`setup.sql`);
- the publishable key, already filled in `site/config.js`.

What's left takes about 10 minutes.

### 1. Create your instructor account

1. In the Supabase dashboard, open your project and go to **Authentication > Users**.
2. Click **Add user > Create new user**.
3. Enter your email and a password, tick **Auto Confirm User**, and click **Create user**.

### 2. Stop strangers from creating accounts

In **Authentication**, open the sign-in settings (listed as **Sign In / Providers**), turn off **Allow new users to sign up**, and save. Students never need an account.

### 3. Make that account the instructor

Either tell Claude the email you used, or go to **SQL Editor > New query**, run this line with your email, and check it says **Success**:

```sql
insert into public.quiz_admins (email) values ('your-email@ism.lt');
```

### 4. Put the pages online with GitHub Pages

1. On GitHub, click **New repository**. Name it, for example, `quiz`, choose **Public**, and click **Create repository**.
2. Click **uploading an existing file**, drag in **all the files inside `site/`** (not the folder itself, and not `setup.sql`), and click **Commit changes**.
3. Go to the repository's **Settings > Pages**. Under **Build and deployment**, set **Source** to **Deploy from a branch**, choose **main** and **/ (root)**, and click **Save**.
4. After a minute, the page shows your address, for example `https://YOUR-GITHUB-NAME.github.io/quiz/`.

### 5. Test it before class

1. On your laptop, open `https://YOUR-GITHUB-NAME.github.io/quiz/instructor.html` and sign in.
2. On your phone, **turn Wi-Fi off** so it's on mobile data, scan the QR code, and submit a test answer.
3. Check that the response appears on the instructor screen, then click **Reset for a new class**.

If that works, students can join from any connection.

---

## In class

1. Open `instructor.html` on your GitHub Pages address, sign in, and project it.
2. Students scan the QR code, type their full name, and answer.
3. Use the buttons as needed:
   - **Show answers** highlights the correct options and shows the average score. Answers stay hidden until you click it.
   - **See answers by student** opens a separate tab with each student's answers. Keep that tab off the projector.
   - **Download results (CSV)** saves this class's results.
   - **Close quiz** stops new answers. **Reopen quiz** allows them again.
   - **Reset for a new class** starts the screen at 0 responses for the next group. Earlier classes' answers stay saved in Supabase (**Table Editor > quiz_responses**).

**After a week without use, Supabase's free plan pauses the project.** The pages will then say they can't reach the database. Open the Supabase dashboard and click **Restore project** before class. It takes a few minutes.

---

## Changing the questions

Edit section 6 of `setup.sql` and run the whole file again in the SQL Editor. Saved responses are kept.

`answer` is the position of the correct option: `0` = A, `1` = B, `2` = C, `3` = D.

For a different quiz, copy section 6, give it a new `quiz_id` (for example `kydd-ch2`), run it, and change `quizId` in `site/config.js` to match. Then upload `config.js` to GitHub again.

---

## If something goes wrong

| What you see | What to do |
| --- | --- |
| "Couldn't reach the quiz database" | The project is probably paused. Restore it in the Supabase dashboard. |
| "This account isn't set as the instructor" | Put your sign-in email in step 1 of `setup.sql` and run the file again. |
| "Wrong email or password" | Reset the password under **Authentication > Users** in Supabase. |
| "No quiz called … exists" | Run `setup.sql`, and check that `quizId` in `config.js` matches its `quiz_id`. |
| Changes don't show up | GitHub Pages takes a minute to update. Reload the page. |
