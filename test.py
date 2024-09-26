from PIL import Image
import glob
import os
import json

images = glob.glob("data/Fly1/*.jpg")

for image in images :
    img = Image.open(image)
    print(os.path.basename(image).split(".")[0])
    img.thumbnail((1000,1000) , Image.LANCZOS)
    img.save(f"data/papillon_big/thumbnails/{os.path.basename(image)}", "JPEG")
