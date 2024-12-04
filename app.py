from flask import Flask, render_template, jsonify, request, send_from_directory, abort

from flask_cors import CORS, cross_origin

from base64 import encodebytes
import glob
import io
import os
from PIL import Image
import json
import numpy as np


cwd = os.getcwd()

# configuration
DEBUG = True
DATA_FOLDER = f"{cwd}/data"

# instantiate the app
app = Flask(__name__, static_folder="frontend/dist/static", template_folder="frontend/dist", static_url_path="/static")
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config.from_object(__name__)

# definitions
SITE = {
        'logo': 'Sphaeroptica',
        'version': '2.0.0'
}

OWNER = {
        'name': 'Royal Belgian Institute of Natural Sciences',
}

# pass data to the frontend
site_data = {
    'site': SITE,
    'owner': OWNER
}

# landing page
@app.route('/<id>')
def welcome(id):
  return render_template('index.html', **site_data)

def get_response_image(image_path):
    pil_img = Image.open(image_path, mode='r') # reads the PIL image
    byte_arr = io.BytesIO()
    pil_img.save(byte_arr, format=pil_img.format) # convert the PIL image to byte array
    encoded_img = encodebytes(byte_arr.getvalue()).decode('ascii') # encode as base64
    
    return {"image": f"data:image/{pil_img.format.lower()};base64, {encoded_img}",
            "format": pil_img.format.lower(),
            "height": pil_img.height,
            "width": pil_img.width
          }
# send single image
@app.route('/<id>/<image_name>')
@cross_origin()
def image(id, image_name):
  directory = f"{DATA_FOLDER}/{id}"
  image_data = {}
  try:
    image_data = get_response_image(f"{directory}/{image_name}")
    image_data["name"] = image_name
               
  except Exception as error:
    print(error)
    
#  return send_from_directory(DATA_FOLDER, f"{path}/{image_name}")
  return image_data

# send images
@app.route('/<id>/images')
@cross_origin()
def images(id):
  directory = f"{DATA_FOLDER}/{id}"
  if not os.path.exists(directory):
    abort(404)
  with open(f"{directory}/stack.json", "r") as f:
    stack_file = json.load(f)
  to_jsonify = {}
  encoded_images = []
  for image_name in stack_file["stack"]:
    try:
      image_data = get_response_image(f"{directory}/{stack_file['thumbnails']}/{image_name}")
      image_data["name"] = image_name
      encoded_images.append(image_data)
    except Exception as error:
       print(error)
       continue
  stackedImages = dict()
  for image_name in stack_file["Stacked_images"]:
    try:
      image_data = get_response_image(f"{directory}/{stack_file['thumbnails']}/{stack_file['Stacked_images'][image_name]}")
      image_data["name"] = stack_file['Stacked_images'][image_name]
      stackedImages[image_name] = image_data
    except Exception as error:
       print(error)
       continue
  to_jsonify["stackImages"] = encoded_images
  to_jsonify["individualImages"] = stackedImages
  to_jsonify["size"] = {
    "width" : stack_file["width"],
    "height" : stack_file["height"]
  }
  to_jsonify["voxel"] = stack_file["voxel"]
  
  return jsonify({'result': to_jsonify})

if __name__ == '__main__':
    app.run()
