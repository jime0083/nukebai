// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Your web app's Firebase configuration is in firebase-config.js (loaded in popup.html)
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', function() {
  const videoIdInput = document.getElementById('videoId');
  const reportButton = document.getElementById('reportButton');
  const reasonCheckboxes = document.querySelectorAll('input[name="reason"]');
  const reportForm = document.getElementById('reportForm');
  const successMessage = document.getElementById('successMessage');

  // Function to normalize Video ID (full-width to half-width, toLowerCase)
  function normalizeVideoId(id) {
    if (!id) return '';
    return id.replace(/[！-～]/g, function(match) { // Covers full-width alphanumeric and symbols
        return String.fromCharCode(match.charCodeAt(0) - 0xFEE0);
      }).toLowerCase(); // Convert to lowercase
  }

  // Function to attempt Video ID extraction (very basic)
  function extractVideoId(url) {
    if (!url) return '';
    try {
      const urlObj = new URL(url);
      // Example: YouTube ?v=VIDEO_ID
      if (urlObj.hostname.includes('youtube.com') && urlObj.searchParams.has('v')) {
        return urlObj.searchParams.get('v');
      }
      // Example: some_site.com/videos/VIDEO_ID
      const pathSegments = urlObj.pathname.split('/');
      if (pathSegments.length > 2 && pathSegments[pathSegments.length - 2] === 'videos') {
        return pathSegments[pathSegments.length - 1];
      }
      // Add more specific extraction rules for target sites here
    } catch (e) {
      console.error('Error parsing URL for Video ID:', e);
    }
    return ''; // Return empty if no specific pattern matches
  }

  // Get current tab information and display it
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      videoIdInput.value = extractVideoId(currentTab.url);
    } else {
      // videoIdInput.value will remain as is or empty if no URL
    }
  });

  reportButton.addEventListener('click', async function(event) { // Make async for await
    chrome.tabs.query({ active: true, currentWindow: true }, async function(tabs) { // Make this callback async too
      const currentTab = tabs[0];
      if (currentTab && currentTab.url) {
        const selectedReasons = [];
        reasonCheckboxes.forEach(checkbox => {
          if (checkbox.checked) {
            selectedReasons.push(checkbox.value);
          }
        });

        const rawVideoId = videoIdInput.value.trim();
        const normalizedVideoId = normalizeVideoId(rawVideoId);

        const reportData = {
          url: currentTab.url, // Still needed for context
          videoId: normalizedVideoId, // Use normalized ID
          reasons: selectedReasons,
          reportedAt: new Date().toISOString(),
          reporterId: null // Will be filled after Firebase auth
        };

        console.log('Reporting data:', reportData);
        reportButton.disabled = true;
        reportButton.textContent = '報告中...';

        try {
          const docRef = await addDoc(collection(db, "extension_reports"), {
            ...reportData,
            reportedAt: serverTimestamp(), // Adds a server-side timestamp
            reporterId: "extension_user_anonymous" // Placeholder until auth is implemented
          });
          console.log("Document written with ID: ", docRef.id);

          // Show success message and hide form
          if (reportForm && successMessage) {
            reportForm.style.display = 'none';
            successMessage.style.display = 'block';
          }
          // Optionally, you can close the popup after a short delay
          // setTimeout(() => window.close(), 3000);

        } catch (e) {
          console.error("Error adding document: ", e);
          alert('レポートの送信に失敗しました。コンソールで詳細を確認してください。');
          reportButton.disabled = false;
          reportButton.textContent = '報告';
        }
      } else {
        alert('Could not get current tab information.');
      }
    });
  });
});
