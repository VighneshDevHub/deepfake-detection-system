"""
Run this once to generate PNG icons from icon.svg.
Requires: pip install cairosvg  OR  pip install Pillow
"""
import os

sizes = [16, 48, 128]
script_dir = os.path.dirname(os.path.abspath(__file__))

try:
    import cairosvg
    svg_path = os.path.join(script_dir, "icon.svg")
    for size in sizes:
        out = os.path.join(script_dir, f"icon{size}.png")
        cairosvg.svg2png(url=svg_path, write_to=out, output_width=size, output_height=size)
        print(f"Generated {out}")
except ImportError:
    # Fallback: generate solid-color PNGs with Pillow
    try:
        from PIL import Image, ImageDraw
        for size in sizes:
            img = Image.new("RGBA", (size, size), (99, 102, 241, 255))
            draw = ImageDraw.Draw(img)
            # Simple circle as placeholder
            margin = size // 8
            draw.ellipse([margin, margin, size - margin, size - margin], fill=(255, 255, 255, 200))
            out = os.path.join(script_dir, f"icon{size}.png")
            img.save(out)
            print(f"Generated {out}")
    except ImportError:
        print("Install cairosvg or Pillow to generate icons:")
        print("  pip install cairosvg")
        print("  -- or --")
        print("  pip install Pillow")
        print("\nAlternatively, place your own icon16.png, icon48.png, icon128.png in this folder.")
