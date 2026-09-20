import numpy as np
from PIL import Image, ImageDraw

W, H = 900, 1800
img = Image.new("L", (W, H), 255)
draw = ImageDraw.Draw(img)
cx = W // 2
INK = 20

def bez(p0, p1, p2, n=60):
    return [((1-t)**2*p0[0]+2*(1-t)*t*p1[0]+t**2*p2[0], (1-t)**2*p0[1]+2*(1-t)*t*p1[1]+t**2*p2[1]) for t in np.linspace(0,1,n)]

def cub(p0, p1, p2, p3, n=60):
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
    return [(W-x, y) for x, y in pts]

HW = 28

# TOP HORN LEFT
drw(cub((cx,300),(cx-60,220),(cx-150,120),(cx-110,20)), HW)
drw(mir(cub((cx,300),(cx-60,220),(cx-150,120),(cx-110,20))), HW)

# TOP BODY left edge going down
drw(cub((cx,300),(cx-90,380),(cx-180,460),(cx-200,540)), HW)
drw(mir(cub((cx,300),(cx-90,380),(cx-180,460),(cx-200,540))), HW)

# UPPER DIAMOND - crossing strokes
# Stroke A: from top-left of diamond down to center
drw(bez((cx-200,540),(cx-90,620),(cx,660)), HW)
drw(mir(bez((cx-200,540),(cx-90,620),(cx,660))), HW)
# Stroke B: from top-right of diamond down to center (crosses A at 90)
drw(bez((cx+200,540),(cx+90,620),(cx,660)), HW)
drw(mir(bez((cx+200,540),(cx+90,620),(cx,660))), HW)

# Bottom half of upper diamond
drw(bez((cx,660),(cx-90,700),(cx-200,780)), HW)
drw(mir(bez((cx,660),(cx-90,700),(cx-200,780))), HW)
drw(bez((cx,660),(cx+90,700),(cx+200,780)), HW)
drw(mir(bez((cx,660),(cx+90,700),(cx+200,780))), HW)

# WAIST - narrows
drw(bez((cx-200,780),(cx-140,820),(cx-90,860)), HW)
drw(mir(bez((cx-200,780),(cx-140,820),(cx-90,860))), HW)

# LOWER DIAMOND - crossing strokes
drw(bez((cx-90,860),(cx-140,900),(cx-200,940)), HW)
drw(mir(bez((cx-90,860),(cx-140,900),(cx-200,940))), HW)

# Lower diamond crossings
drw(bez((cx-200,940),(cx-90,1020),(cx,1060)), HW)
drw(mir(bez((cx-200,940),(cx-90,1020),(cx,1060))), HW)
drw(bez((cx+200,940),(cx+90,1020),(cx,1060)), HW)
drw(mir(bez((cx+200,940),(cx+90,1020),(cx,1060))), HW)

drw(bez((cx,1060),(cx-90,1100),(cx-200,1180)), HW)
drw(mir(bez((cx,1060),(cx-90,1100),(cx-200,1180))), HW)
drw(bez((cx,1060),(cx+90,1100),(cx+200,1180)), HW)
drw(mir(bez((cx,1060),(cx+90,1100),(cx+200,1180))), HW)

# LOWER BODY narrowing to tail
drw(cub((cx-200,1180),(cx-160,1250),(cx-80,1350),(cx,1420)), HW)
drw(mir(cub((cx-200,1180),(cx-160,1250),(cx-80,1350),(cx,1420))), HW)

# TAIL points
drw(cub((cx,1420),(cx-30,1500),(cx-20,1600),(cx-5,1680)), HW)
drw(mir(cub((cx,1420),(cx-30,1500),(cx-20,1600),(cx-5,1680))), HW)

img.save(r"C:\Users\alexi\Downloads\Mobile Devices\tattoo_solid.png", quality=95)
print("Done: tattoo_solid.png")
