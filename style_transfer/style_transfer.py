import numpy as np 
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.applications import vgg19

base_image_path = "./img/base/paris.jpg"
style_image_path = "./img/style/starry-night.jpg"

# Weights of the different loss components
total_variation_weight = 1e-6
style_weight = 1e-6
content_weight = 2.5e-8

# Dimensions of the generated picture.
width, height = keras.preprocessing.image.load_img(base_image_path).size
img_nrows = 400
img_ncols = int(width * img_nrows / height)

from IPython.display import Image, display

display(Image(base_image_path))
display(Image(style_image_path))
