import fs from 'fs';

async function updateFirebase() {
  const firebaseUrl = "https://english-learning-platfor-d50c1-default-rtdb.asia-southeast1.firebasedatabase.app/portfolio.json";
  
  try {
    const res = await fetch(firebaseUrl);
    const data = await res.json();
    
    // The default detailed CV data and new image
    const newImage = "https://media.licdn.com/dms/image/v2/D5603AQHi4U2qZOS40Q/profile-displayphoto-shrink_400_400/B56Zkvg8OYHMAk-/0/1757438789898?e=1776297600&v=beta&t=yVS-v7nC8g-thZoamRpI4ZoyNTOuxGEomCeXJd0SzGc";
    if (!data.personalImages) data.personalImages = [];
    data.personalImages[0] = newImage;
    
    // We already have DEFAULT_DATA.cv embedded in constants.ts. We'll just define the specific fields here to ensure it's fully pushed to Firebase!
    // But since it's hard to copy massive objects, I'll dynamic import or parse it from constants.ts!
    // It's a typescript file. Let's just read constants.ts, extract DEFAULT_DATA JSON, or use ts-node.
    // Instead of parsing, we can just run this logic inside the actual app via a temporary fetch.
  } catch(e) {
    console.error(e);
  }
}

updateFirebase();
