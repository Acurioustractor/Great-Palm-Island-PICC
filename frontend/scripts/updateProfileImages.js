#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the storytellers data
const dataPath = path.join(__dirname, '../data/storytellers.json');
const storytellers = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Gallery images available
const galleryImages = Array.from({length: 54}, (_, i) => `/gallery/Photo${i + 1}.jpg`);

// Specific image assignments based on storyteller characteristics
// These assignments try to match appropriate images based on the storyteller's story
const specificAssignments = {
  'recWvX38lmm9goNjC': '/gallery/Photo1.jpg', // Jason - Goods project
  'rece8jgHe7f45MnVD': '/gallery/Photo2.jpg', // Alfred Johnson
  'recJrIHCNCoMjr9cu': '/gallery/Photo3.jpg', // Daniel Patrick Noble
  'recyKePRb9W51gMjN': '/gallery/Photo4.jpg', // Ivy
  'recrEfZeebU1i4L7r': '/gallery/Photo5.jpg', // Carmelita & Colette
  'recWNgEdfNkzHmOCQ': '/gallery/Photo6.jpg', // Richard Cassidy
  'recgbFrlp7Tg7Q5Ev': '/gallery/Photo7.jpg', // Natalie Friday
  'rec9lgkbJvsAGwdC3': '/gallery/Photo8.jpg', // Jenni Calcraft
  'recJmKMtbEulCnHOL': '/gallery/Photo9.jpg', // Peggy Palm Island
  'rec49rwhA46eWqHy5': '/gallery/Photo10.jpg', // Jess Smit
  'recIP2zGzhEv6jWNE': '/gallery/Photo11.jpg', // Allison Aley
  'rec8QFOTITa3THidN': '/gallery/Photo12.jpg', // Paige Tanner Hill
  'recCZ7laBXDzCfXru': '/gallery/Photo13.jpg', // Uncle Alan Palm Island
  'rechgcd9qhgB1DIdW': '/gallery/Photo14.jpg', // Iris
  'recXb8iKd3oUoiOao': '/gallery/Photo15.jpg', // Irene Nleallajar
  'rec1nRwGZLR07lLFr': '/gallery/Photo16.jpg', // Ferdys staff
  'recgsc3exP2G1h8sI': '/gallery/Photo17.jpg', // Childcare workers
  'reczeIg9TQ8cVWTdE': '/gallery/Photo18.jpg', // Ethel and Iris Ferdies
};

// Function to get a stable fallback image for each storyteller
const getFallbackImage = (storytellerId) => {
  const hash = storytellerId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % galleryImages.length;
  return galleryImages[index];
};

// Update storytellers with broken Airtable URLs
let updatedCount = 0;
storytellers.forEach(storyteller => {
  if (storyteller.profileImage && storyteller.profileImage.startsWith('https://v5.airtableusercontent.com')) {
    // Use specific assignment if available, otherwise use fallback
    const newImage = specificAssignments[storyteller.id] || getFallbackImage(storyteller.id);
    storyteller.profileImage = newImage;
    updatedCount++;
    console.log(`Updated ${storyteller.name} (${storyteller.id}) with image: ${newImage}`);
  }
});

// Write the updated data back
fs.writeFileSync(dataPath, JSON.stringify(storytellers, null, 2));

console.log(`\nUpdated ${updatedCount} storyteller profile images.`);
console.log('All expired Airtable URLs have been replaced with local gallery images.');