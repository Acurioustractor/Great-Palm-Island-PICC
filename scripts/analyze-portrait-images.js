#!/usr/bin/env node

/**
 * Portrait Image Analysis Script
 * 
 * This script analyzes profile images to identify portraits and suggests
 * better positioning for face visibility. It can be extended to include
 * automated face detection in the future.
 */

const fs = require('fs');
const path = require('path');

// Read the storytellers data
const storytellersPath = path.join(__dirname, '../frontend/data/storytellers.json');
const storytellers = JSON.parse(fs.readFileSync(storytellersPath, 'utf8'));

console.log('🔍 Portrait Image Analysis Report');
console.log('=================================\n');

let totalImages = 0;
let portraitImages = 0;
let landscapeImages = 0;
let noImages = 0;

const portraits = [];
const landscapes = [];

storytellers.forEach((storyteller, index) => {
  const imageData = storyteller.metadata?.['File Profile Image']?.[0];
  
  if (imageData && imageData.width && imageData.height) {
    totalImages++;
    const aspectRatio = imageData.width / imageData.height;
    const isPortrait = aspectRatio < 0.8;
    
    if (isPortrait) {
      portraitImages++;
      portraits.push({
        name: storyteller.name,
        id: storyteller.id,
        width: imageData.width,
        height: imageData.height,
        aspectRatio: aspectRatio.toFixed(2),
        url: imageData.url,
        filename: imageData.filename
      });
    } else {
      landscapeImages++;
      landscapes.push({
        name: storyteller.name,
        id: storyteller.id,
        width: imageData.width,
        height: imageData.height,
        aspectRatio: aspectRatio.toFixed(2),
        url: imageData.url,
        filename: imageData.filename
      });
    }
  } else {
    noImages++;
  }
});

console.log(`📊 Image Statistics:`);
console.log(`   Total storytellers: ${storytellers.length}`);
console.log(`   With images: ${totalImages}`);
console.log(`   Portrait images: ${portraitImages} (${((portraitImages/totalImages)*100).toFixed(1)}%)`);
console.log(`   Landscape images: ${landscapeImages} (${((landscapeImages/totalImages)*100).toFixed(1)}%)`);
console.log(`   No images: ${noImages}`);
console.log('');

if (portraits.length > 0) {
  console.log('📸 Portrait Images (requiring special positioning):');
  console.log('==================================================');
  portraits.forEach(portrait => {
    console.log(`   👤 ${portrait.name}`);
    console.log(`      Size: ${portrait.width}x${portrait.height} (${portrait.aspectRatio} ratio)`);
    console.log(`      File: ${portrait.filename}`);
    console.log(`      Current positioning: 50% 35% (improved from 50% 25%)`);
    console.log('');
  });
}

console.log('💡 Recommendations:');
console.log('==================');
console.log('1. ✅ Updated object-position for portraits from "50% 25%" to "50% 35%"');
console.log('2. ✅ Added portrait detection to all card components');
console.log('3. ✅ Consistent positioning across StoryCard, Profile pages, and Video pages');
console.log('4. 🔄 Consider implementing face detection for even better positioning');
console.log('5. 🔄 Test with actual users to validate face visibility');
console.log('');

console.log('🎯 Next Steps:');
console.log('=============');
console.log('1. Deploy the updated positioning changes');
console.log('2. Test with portrait images in browser');
console.log('3. Collect user feedback on face visibility');
console.log('4. Consider implementing AI face detection for optimal positioning');
console.log('');

// Generate a summary report
const report = {
  timestamp: new Date().toISOString(),
  totalStorytellers: storytellers.length,
  totalImages,
  portraitImages,
  landscapeImages,
  noImages,
  portraitPercentage: ((portraitImages/totalImages)*100).toFixed(1),
  portraits: portraits.map(p => ({
    name: p.name,
    id: p.id,
    aspectRatio: p.aspectRatio,
    filename: p.filename
  })),
  improvements: [
    'Updated object-position for portraits from 50% 25% to 50% 35%',
    'Added portrait detection to all card components',
    'Consistent positioning across all components'
  ],
  recommendations: [
    'Deploy updated positioning changes',
    'Test with portrait images in browser',
    'Collect user feedback on face visibility',
    'Consider implementing AI face detection'
  ]
};

// Save the report
const reportPath = path.join(__dirname, '../portrait-analysis-report.json');
fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
console.log(`📋 Full report saved to: ${reportPath}`);