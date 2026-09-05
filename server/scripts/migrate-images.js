/**
 * ================================================
 * IMAGE MIGRATION SCRIPT
 * ================================================
 * Migrates images from local uploads/ to Cloudinary
 * Updates database with new Cloudinary URLs
 * ================================================
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { cloudinary } = require('../config/cloudinary');
const { supabase } = require('../config/supabase');

// Configuration
const UPLOADS_DIR = path.join(__dirname, '../uploads');
const DRY_RUN = process.env.DRY_RUN === 'true'; // Set to 'true' to test without uploading

console.log('🚀 Image Migration: Local → Cloudinary');
console.log('==========================================');
console.log('');

if (DRY_RUN) {
  console.log('⚠️  DRY RUN MODE - No actual uploads or database changes');
  console.log('');
}

/**
 * Upload single file to Cloudinary
 */
async function uploadToCloudinary(filePath, folder = 'portfolio') {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto',
      use_filename: true,
      unique_filename: true
    });
    
    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Scan uploads directory and find all images
 */
function findAllImages() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.log('❌ Uploads directory not found:', UPLOADS_DIR);
    return [];
  }

  const files = fs.readdirSync(UPLOADS_DIR);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });
}

/**
 * Update database records with new Cloudinary URL
 */
async function updateDatabase(oldPath, newUrl) {
  const updates = [];

  // Update projects.images (JSON array)
  const { data: projects } = await supabase
    .from('projects')
    .select('id, images')
    .contains('images', [oldPath]);

  if (projects && projects.length > 0) {
    for (const project of projects) {
      const newImages = project.images.map(img => 
        img === oldPath ? newUrl : img
      );
      
      if (!DRY_RUN) {
        await supabase
          .from('projects')
          .update({ images: newImages })
          .eq('id', project.id);
      }
      
      updates.push(`Project #${project.id}: images array`);
    }
  }

  // Update blog_posts.image
  const { data: blogs } = await supabase
    .from('blog_posts')
    .select('id, slug')
    .eq('image', oldPath);

  if (blogs && blogs.length > 0) {
    for (const blog of blogs) {
      if (!DRY_RUN) {
        await supabase
          .from('blog_posts')
          .update({ image: newUrl })
          .eq('id', blog.id);
      }
      
      updates.push(`Blog "${blog.slug}": image`);
    }
  }

  // Update certificates.image
  const { data: certs } = await supabase
    .from('certificates')
    .select('id, title_en')
    .eq('image', oldPath);

  if (certs && certs.length > 0) {
    for (const cert of certs) {
      if (!DRY_RUN) {
        await supabase
          .from('certificates')
          .update({ image: newUrl })
          .eq('id', cert.id);
      }
      
      updates.push(`Certificate "${cert.title_en}": image`);
    }
  }

  // Update settings (hero_images)
  const { data: settings } = await supabase
    .from('settings')
    .select('*')
    .eq('setting_key', 'hero_images')
    .single();

  if (settings && settings.setting_value) {
    const heroImages = settings.setting_value;
    if (Array.isArray(heroImages) && heroImages.includes(oldPath)) {
      const newHeroImages = heroImages.map(img => 
        img === oldPath ? newUrl : img
      );
      
      if (!DRY_RUN) {
        await supabase
          .from('settings')
          .update({ setting_value: newHeroImages })
          .eq('setting_key', 'hero_images');
      }
      
      updates.push('Settings: hero_images');
    }
  }

  return updates;
}

/**
 * Main migration function
 */
async function migrate() {
  console.log('📁 Scanning uploads directory...');
  const images = findAllImages();
  
  if (images.length === 0) {
    console.log('✅ No images found to migrate');
    return;
  }

  console.log(`📊 Found ${images.length} images to migrate`);
  console.log('');

  const results = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: []
  };

  for (let i = 0; i < images.length; i++) {
    const filename = images[i];
    const filePath = path.join(UPLOADS_DIR, filename);
    const oldPath = `/uploads/${filename}`;

    console.log(`[${i + 1}/${images.length}] Processing: ${filename}`);

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(filePath);

    if (!uploadResult.success) {
      console.log(`   ❌ Upload failed: ${uploadResult.error}`);
      results.failed++;
      results.errors.push({ filename, error: uploadResult.error });
      continue;
    }

    console.log(`   ✅ Uploaded: ${uploadResult.url}`);

    // Update database
    const dbUpdates = await updateDatabase(oldPath, uploadResult.url);

    if (dbUpdates.length > 0) {
      console.log(`   📝 Updated ${dbUpdates.length} database record(s):`);
      dbUpdates.forEach(update => console.log(`      - ${update}`));
      results.success++;
    } else {
      console.log(`   ⚠️  No database records found for this image`);
      results.skipped++;
    }

    console.log('');
  }

  // Summary
  console.log('==========================================');
  console.log('📊 Migration Summary');
  console.log('==========================================');
  console.log(`✅ Successfully migrated: ${results.success}`);
  console.log(`⚠️  Skipped (no DB refs): ${results.skipped}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log('');

  if (results.errors.length > 0) {
    console.log('❌ Errors:');
    results.errors.forEach(({ filename, error }) => {
      console.log(`   - ${filename}: ${error}`);
    });
    console.log('');
  }

  if (!DRY_RUN) {
    console.log('✅ Migration complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Verify images load correctly on frontend');
    console.log('2. Backup and remove old uploads/ directory');
    console.log('3. Update .gitignore to remove uploads/ entry');
  } else {
    console.log('ℹ️  This was a DRY RUN. Run without DRY_RUN=true to perform actual migration.');
  }
}

// Run migration
migrate().catch(error => {
  console.error('❌ Migration failed:', error);
  process.exit(1);
});
