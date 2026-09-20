import numpy as np
from PIL import Image, ImageDraw

W, H = 900, 1800
img = Image.new("L", (W, H), 255)
draw = ImageDraw.Draw(img)
cx = W // 2
INK = 20

def bez(p0, p1, p2, n=80):
    return [((1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t**2*p2[0], (1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t**2*p2[1]) for t in np.linspace(0,1,n)]

def cub(p0, p1, p2, p3, n=80):
    return [((1-t)**3*p0[0]+3*(1-t)**2*t*p1[0]+3*(1-t)*t**2*p2[0]+t**3*p3[0], (1-t)**3*p0[1]+3*(1-t)**2*t*p1[1]+3*(1-t)*t**2*p2[1]+t**3*p3[1]) for t in np.linspace(0,1,n)]

def ribbon(pts, hw):
    left, right = [], []
    for i in range(len(pts)):
        if i == 0: dx, dy = pts[1][0]-pts[0][0], pts[1][1]-pts[0][1]
        elif i == len(pts)-1: dx, dy = pts[-1][0]-pts[-2][0], pts[-1][1]-pts[-2][1]
        else: dx, dy = pts[i+1][0]-pts[i-1][0], pts[i+1][1]-pts[i-1][1]
        ln = max(np.sqrt(dx*dx+dy*dy), 0.001)
        nx, ny = -dy/ln, dx/ln
        left.append((pts[i][0]+nx*hw, pts[i][1]+ny*hw))
        right.append((pts[i][0]-nx*hw, pts[i][1]-ny*hw))
    right.reverse()
    return left + right

def drw(pts, hw=28):
    draw.polygon(ribbon(pts, hw), fill=INK)

def mir(pts):
    if isinstance(pts, tuple):
        return (W-pts[0], pts[1])
    return [(W-x, y) for x, y in pts]

# =============================================
# THE DESIGN: Two main thick strokes crossing
# in an X, with wider head/tail and triangular
# cutouts. Symmetrical vertically.
# =============================================

# The X crossing happens at center (cx, 750)
# Stroke 1: goes from upper-right down to lower-left
# Stroke 2: goes from upper-left down to lower-right (mirrored)

# But we want it SYMMETRICAL, so:
# Left half and right half are mirror images

# Let me build it as a solid shape with cutouts

# MAIN BODY OUTLINE - the overall shape
# Starting from top-center, going clockwise

# Top pointed tip (center top)
top_tip = (cx, 180)

# Upper right edge - curves out to right horn
upper_r = cub((cx,180), (cx+40,260), (cx+160,340), (cx+210,420))

# Right horn tip
horn_r = (cx+240, 460)

# Right side narrows to crossing
cross_r = cub((cx+240,460), (cx+200,520), (cx+140,600), (cx+100,680))

# Crossing point right extension
ext_r = (cx+160, 750)

# Right side below crossing widens
lower_r_wide = cub((cx+160,750), (cx+140,800), (cx+200,880), (cx+220,960))

# Right lower horn
lower_horn_r = (cx+240, 1020)

# Right side narrows to tail
tail_r = cub((cx+240,1020), (cx+200,1100), (cx+100,1250), (cx+20,1400))

# Bottom tail tip
tail_tip = (cx, 1480)

# Mirror for left side
upper_l = mir(upper_r)
ext_l = mir(ext_r)
lower_l_wide = mir(lower_r_wide)
tail_l = mir(tail_r)

# Build full outline
outline = [top_tip] + upper_r + [horn_r] + cross_r + [ext_r] + lower_r_wide + [lower_horn_r] + tail_r + [tail_tip] + mir(tail_r)[::-1] + [mir(lower_horn_r)] + mir(lower_r_wide)[::-1] + [mir(ext_r)] + mir(cross_r)[::-1] + [mir(horn_r)] + mir(upper_r)[::-1]

draw.polygon(outline, fill=INK)

# TRIANGULAR CUTOUTS (negative space)
# These are the triangular holes inside the solid shape

# Upper cutouts - two triangles in the head section
cut1_r = [(cx+60,320), (cx+130,400), (cx+60,480)]
cut1_l = mir(cut1_r)
draw.polygon(cut1_r, fill=255)
draw.polygon(cut1_l, fill=255)

# Middle diamond cutout at crossing
cut_diamond = [(cx,680), (cx+70,750), (cx,820), (cx-70,750)]
draw.polygon(cut_diamond, fill=255)

# Lower cutouts - two triangles in the tail section
cut2_r = [(cx+60,1000), (cx+130,1080), (cx+60,1160)]
cut2_l = mir(cut2_r)
draw.polygon(cut2_r, fill=255)
draw.polygon(cut2_l, fill=255)

img.save(r"C:\Users\alexi\Downloads\Mobile Devices\tattoo_v3.png", quality=95)
print("Done: tattoo_v3.png")
