<?php

namespace App\Traits;

trait CompressibleBase64
{
    /**
     * Resizes and compresses an image file into a Base64 string.
     * Keeps images under a reasonable size for database storage and network transfer.
     */
    protected function imageToBase64($file, $maxWidth = 800, $maxHeight = 840, $quality = 60)
    {
        $mime = $file->getMimeType();
        $path = $file->getRealPath();

        // Load image based on mime type
        switch ($mime) {
            case 'image/jpeg':
            case 'image/jpg':
                $img = imagecreatefromjpeg($path);
                break;
            case 'image/png':
                $img = imagecreatefrompng($path);
                // Preserve transparency for PNG
                imagepalettetotruecolor($img);
                imagealphablending($img, true);
                imagesavealpha($img, true);
                break;
            case 'image/webp':
                $img = imagecreatefromwebp($path);
                break;
            default:
                // Fallback to original size if format not supported for resizing
                return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
        }

        if (!$img) {
            return 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($path));
        }

        $width = imagesx($img);
        $height = imagesy($img);

        // Calculate new dimensions
        $ratio = min($maxWidth / $width, $maxHeight / $height);
        if ($ratio < 1) {
            $newWidth = (int)($width * $ratio);
            $newHeight = (int)($height * $ratio);
            
            $newImg = imagecreatetruecolor($newWidth, $newHeight);
            
            // Handle transparency for PNG/WebP in destination
            if ($mime == 'image/png' || $mime == 'image/webp') {
                imagealphablending($newImg, false);
                imagesavealpha($newImg, true);
                $transparent = imagecolorallocatealpha($newImg, 255, 255, 255, 127);
                imagefilledrectangle($newImg, 0, 0, $newWidth, $newHeight, $transparent);
            }

            imagecopyresampled($newImg, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
            imagedestroy($img);
            $img = $newImg;
        }

        // Buffer the output
        ob_start();
        // We output as WebP if possible for best compression, or JPEG
        if ($mime == 'image/png' || $mime == 'image/webp') {
            imagewebp($img, null, $quality);
            $outputMime = 'image/webp';
        } else {
            imagejpeg($img, null, $quality);
            $outputMime = 'image/jpeg';
        }
        $data = ob_get_clean();
        imagedestroy($img);

        return 'data:' . $outputMime . ';base64,' . base64_encode($data);
    }
}
