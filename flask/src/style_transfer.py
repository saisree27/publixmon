import numpy as np
import cv2 as cv
import random
import time
import os

NAMES = {
    "../models/eccv16/composition_vii.t7": "Composition VII on a ",
    "../models/eccv16/la_muse.t7": "La Muse on a ",
    "../models/eccv16/starry_night.t7": "Starry Night on a ",
    "../models/eccv16/the_wave.t7": "The Wave on a ",
    "../models/instance_norm/candy.t7": "Candy on a ",
    "../models/instance_norm/feathers.t7": "Feathers on a ",
    "../models/instance_norm/la_muse.t7": "La Muse on a ",
    "../models/instance_norm/mosaic.t7": "Mosaic on a ",
    "../models/instance_norm/the_scream.t7": "The Scream on a ",
    "../models/instance_norm/udnie.t7": "Udnie on a ",
}

def absoluteFilePaths(directory):
    filepaths = []
    for dirpath,_,filenames in os.walk(directory):
        print(dirpath, filenames)
        for f in filenames:
            filepaths.append(dirpath + "/" + f)
    return filepaths


def data_uri_to_cv2_img(uri):
    """
    Decodes base64 image to cv2 image
    """
    print("INFO: Attempting to load image from base64.")
    encoded_data = uri.split(',')[1]
    nparr = np.fromstring(encoded_data.decode('base64'), np.uint8)
    img = cv.imdecode(nparr, cv.IMREAD_COLOR)
    print("INFO: Loaded image.")
    return img

def predict(img, h, w, net):
    blob = cv.dnn.blobFromImage(img, 1.0, (w, h),
        (103.939, 116.779, 123.680), swapRB=False, crop=False)

    print ('[INFO] Setting the input to the model')
    net.setInput(blob)

    print ('[INFO] Starting Inference!')
    start = time.time()
    out = net.forward()
    end = time.time()
    print ('[INFO] Inference Completed successfully!')

    # Reshape the output tensor and add back in the mean subtraction, and
    # then swap the channel ordering
    out = out.reshape((3, out.shape[2], out.shape[3]))
    out[0] += 103.939
    out[1] += 116.779
    out[2] += 123.680
    out /= 255.0
    out = out.transpose(1, 2, 0)
    return out

# Source for this function:
# https://github.com/jrosebr1/imutils/blob/4635e73e75965c6fef09347bead510f81142cf2e/imutils/convenience.py#L65
def resize_img(img, width=None, height=None, inter=cv.INTER_AREA):
    dim = None
    h, w = img.shape[:2]

    if width is None and height is None:
        return img
    elif width is None:
        r = height / float(h)
        dim = (int(w * r), height)
    elif height is None:
        r = width / float(w)
        dim = (width, int(h * r))

    resized = cv.resize(img, dim, interpolation=inter)
    return resized

def get_style_transfer(image):
    list_names = [absoluteFilePaths("./models/")]
    print(list_names)
    model_path = random.choice(list_names[0])
    
    print("INFO: Chosen model %s." % model_path)
    net = cv.dnn.readNetFromTorch(model_path)
    print("INFO: Loaded model.")

    img = resize_img(image, width=600)
    h, w  = img.shape[:2]

    out = predict(img, h, w, net)
    cv.imshow('Stylized image', out)

    out = 255 * (out - out.min()) / (out.max() - out.min())
    out = np.array(out, np.int)
    
    print("INFO: Finished style transfer. Writing file.")
    
    output_file = "output.png"
    cv.imwrite(output_file, out)
    return output_file, NAMES[model_path]