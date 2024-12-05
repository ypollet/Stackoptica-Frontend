from flask import Flask, render_template, jsonify, request, send_from_directory, send_file, abort

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

# send full image
@app.route('/<id>/<image_id>/full-image')
@cross_origin()
def image(id,image_id):
  return send_from_directory(f"{DATA_FOLDER}/{id}", image_id)

# send thumbnail
@app.route('/<id>/<image_id>/thumbnail')
@cross_origin()
def thumbnail(id,image_id):
  return send_from_directory(f"{DATA_FOLDER}/{id}/thumbnails", image_id)

# send StackData
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
  for image in stack_file["stack"]:
    try:
      encoded_images.append(image["name"])
    except Exception as error:
       print(error)
       continue
  stackedImages = dict()
  for image in stack_file["Stacked_images"]:
    try:
      # file name of stacked image
      stackedImages[image] = stack_file['Stacked_images'][image]
    except Exception as error:
       print(error)
       continue
  print(stackedImages)
  to_jsonify["stackImages"] = encoded_images
  to_jsonify["individualImages"] = stackedImages
  to_jsonify["size"] = {
    "width" : stack_file["width"],
    "height" : stack_file["height"]
  }
  
  return jsonify(to_jsonify)

@app.route('/<id>/position')
@cross_origin()
def compute_landmark(id):
  x = float(request.args.get("x"))
  y = float(request.args.get("y"))
  image_index = int(request.args.get("imageIndex"))
  
  directory = f"{DATA_FOLDER}/{id}"
  if not os.path.exists(directory):
    abort(404)
  with open(f"{directory}/stack.json", "r") as f:
    stack_file = json.load(f)
    
  image_data = stack_file["stack"][image_index]
  
  position = {
    "x" : x*image_data["PixelRatio"][0] + image_data["SlicePosition"][0],
    "y" : y*image_data["PixelRatio"][1] + image_data["SlicePosition"][1],
    "z" : image_data["SlicePosition"][2]
  }
  
  return jsonify(position)
  

if __name__ == '__main__':
    app.run()
