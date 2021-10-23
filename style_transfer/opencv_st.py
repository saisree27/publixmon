# from https://github.com/iArunava/Neural-Style-Transfer-with-OpenCV

import argparse
import time
import os
import subprocess
import cv2 as cv
import random
import numpy as np

FLAGS = None
VID = 'video'
IMG = 'image'

def absoluteFilePaths(directory):
    filepaths = []
    for dirpath,_,filenames in os.walk(directory):
        print(dirpath, filenames)
        for f in filenames:
            filepaths.append(dirpath + "/" + f)
    return filepaths

def predict(img, h, w):
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

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    parser.add_argument('-i', '--image',
                type=str,
                help='Path to the image.')

    FLAGS, unparsed = parser.parse_known_args()
    
    list_names = [absoluteFilePaths("./models/")]
    FLAGS.model_path = random.choice(list_names[0])

    # Load the neural style transfer model
    path = FLAGS.model_path + ('' if FLAGS.model_path.endswith('/') else '/')

    print ('[INFO] Loading the model...')

    model_to_load = path
    print(model_to_load[:-1])
    net = cv.dnn.readNetFromTorch(model_to_load[:-1])

    print ('[INFO] Model Loaded successfully!')
    print ('[INFO] Reading the image')
    img = cv.imread(FLAGS.image)
    print ('[INFO] Image Loaded successfully!')

    img = resize_img(img, width=600)
    h, w  = img.shape[:2]

    out = predict(img, h, w)

    cv.imshow('Stylized image', out)
    print ('[INFO] Hit Esc to close!')
    cv.waitKey(0)

    out = 255 * (out - out.min()) / (out.max() - out.min())
    out = np.array(out, np.int)

    cv.imwrite("./img/output/stylizedimage.png", out)