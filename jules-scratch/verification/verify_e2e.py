from playwright.sync_api import sync_playwright, Page, expect
import time
import random

def run(playwright):
    # --- Test Setup ---
    # Use a random number to ensure the user is unique on each run
    unique_id = random.randint(1000, 9999)
    email = f"test.user.{unique_id}@lectura.io"
    password = "password123"
    username = f"tester{unique_id}"
    note_title = f"Test Note {unique_id}"

    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    def full_screenshot(name):
        # Helper function for consistent screenshots
        time.sleep(1) # Allow UI to settle
        page.screenshot(path=f"jules-scratch/verification/{name}.png", full_page=True)
        print(f"📸 Screenshot taken: {name}.png")

    try:
        # --- 1. Registration ---
        print("\n--- Starting E2E Verification ---")
        print(f"🧪 Using credentials: {email} / {username}")
        page.goto("http://localhost:5173/signup", timeout=60000)
        expect(page.get_by_text("Create a New Pilot Profile")).to_be_visible(timeout=15000)
        page.get_by_label("Full Name").fill("E2E Test User")
        page.get_by_label("Username").fill(username)
        page.get_by_label("Email").fill(email)
        page.get_by_label("Password").fill(password)
        page.get_by_label("Repeat Password").fill(password)
        page.get_by_role("button", name="Register").click()
        print("✅ Registration form submitted.")

        # --- 2. Login ---
        # After signup, Supabase shows a "Verify Email" message. We'll proceed to login.
        # This assumes email verification is off for the dev environment.
        expect(page.get_by_text("Verify Your Email")).to_be_visible(timeout=15000)
        print("✅ Reached email verification screen.")
        page.goto("http://localhost:5173/login", timeout=60000)
        expect(page.get_by_text("Log in to the Grid")).to_be_visible(timeout=15000)
        page.get_by_label("Email").fill(email)
        page.get_by_label("Password").fill(password)
        page.get_by_role("button", name="Engage").click()
        print("✅ Login form submitted.")

        # --- 3. Verify Login & Dashboard ---
        expect(page.get_by_text(f"Welcome, {username}!")).to_be_visible(timeout=15000)
        print(f"✅ Successfully logged in as {username}.")
        full_screenshot("01_dashboard_view")

        # --- 4. Create a Note ---
        page.get_by_role("link", name="Upload").click()
        expect(page.get_by_text("Upload Transmission")).to_be_visible(timeout=15000)
        page.get_by_label("Title").fill(note_title)
        page.get_by_label("Course Code").fill("CS101")
        page.get_by_label("File Attachment").set_input_files("jules-scratch/verification/test_note.txt")
        page.get_by_role("button", name="Transmit Note").click()
        print("✅ Note creation form submitted.")

        # --- 5. Verify Note Creation ---
        # The app should navigate to the new note's detail page, we go to the list to verify.
        page.goto("http://localhost:5173/notes")
        expect(page.get_by_text("Note Archive")).to_be_visible(timeout=15000)
        expect(page.get_by_text(note_title)).to_be_visible(timeout=15000)
        print(f"✅ Note '{note_title}' found on notes page.")
        full_screenshot("02_notes_page_with_new_note")

        # --- 6. Test CGPA Page ---
        page.get_by_role("link", name="CGPA").click()
        expect(page.get_by_text("CGPA Tracker")).to_be_visible(timeout=15000)
        # Add a semester
        page.get_by_label("Add New Semester").fill("Y1S1")
        page.get_by_role("button", name="Add").click()
        expect(page.get_by_text("Y1S1")).to_be_visible(timeout=15000)
        print("✅ Semester 'Y1S1' added.")
        # Add a course
        page.get_by_label("Course Code").first.fill("PHY101")
        page.get_by_label("Credit Units").first.fill("3")
        page.get_by_label("Grade").first.fill("A")
        page.get_by_role("button", name="plus icon").first.click()
        expect(page.get_by_text("PHY101 (3 units) - Grade: A")).to_be_visible(timeout=15000)
        print("✅ Course 'PHY101' added.")
        expect(page.get_by_text("5.00")).to_be_visible() # Check if CGPA is updated
        print("✅ CGPA calculation verified.")
        full_screenshot("03_cgpa_page_with_data")

        # --- 7. Logout ---
        page.locator(".w-10.h-10.bg-base-300").click() # Click avatar
        page.get_by_role("button", name="Logout").click()
        print("✅ Logout button clicked.")

        # --- 8. Verify Logout ---
        expect(page.get_by_text("Log in to the Grid")).to_be_visible(timeout=15000)
        print("✅ Successfully logged out and returned to login page.")
        print("\n--- E2E Verification Complete ---")

    except Exception as e:
        print(f"\n❌ AN ERROR OCCURRED: {e}")
        page.screenshot(path="jules-scratch/verification/error_screenshot.png")
    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)