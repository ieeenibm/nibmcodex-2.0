from PIL import Image
import sys

try:
    image_path = "/Users/supun/.gemini/antigravity/brain/f523953e-31eb-40d9-8526-de5c9be3716b/.tempmediaStorage/media_1786202789303.png"
    img = Image.open(image_path).convert("RGBA")
    
    # Get pixel data
    data = img.getdata()
    
    # Get background color from top left pixel
    bg_color = data[0]
    
    # Create new image data where background is transparent
    new_data = []
    tolerance = 15
    for item in data:
        # Check if color is close to background
        if (abs(item[0] - bg_color[0]) <= tolerance and 
            abs(item[1] - bg_color[1]) <= tolerance and 
            abs(item[2] - bg_color[2]) <= tolerance):
            # Make transparent
            new_data.append((255, 255, 255, 0))
        else:
            # Change white text to actual white just in case, or keep original
            new_data.append(item)
            
    img.putdata(new_data)
    
    # Crop bounding box of non-transparent pixels
    bbox = img.getbbox()
    if bbox:
        # Add padding
        pad = 20
        padded_bbox = (
            max(0, bbox[0] - pad),
            max(0, bbox[1] - pad),
            min(img.width, bbox[2] + pad),
            min(img.height, bbox[3] + pad)
        )
        img = img.crop(padded_bbox)
        
    out_path = "/Users/supun/Developer/university/nibmcodex-2.0/public/images/partners/eventframe.png"
    img.save(out_path, "PNG")
    print(f"Saved to {out_path}")
except Exception as e:
    print(e)
    sys.exit(1)
