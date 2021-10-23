from flask import Flask
from flask import request, jsonify
import random
import base64
import numpy as np
import cv2 as cv
from style_transfer import data_uri_to_cv2_img, get_style_transfer
import requests
from urllib.request import urlopen

app = Flask(__name__)

# LIVE APP DATA FOR PROOF-OF-CONCEPT
# ------
active_users = {}
inactive_users = {}


# ------

@app.route('/')
def home():
    return "Why are you here? You shouldn't be here. Klaus is watching you."

# user data routes
@app.route('/adduser', methods = ['POST'])
def add_user():
    email = request.json['email']
    user = inactive_users.pop(email, {"location": None, "portfolio": [], "promos": []})
    active_users[email] = user
    return True

@app.route('/removeuser', methods = ['POST'])
def remove_user():
    email = request.json['email']
    user = active_users.pop(email, None)
    inactive_users[email] = user
    return user

@app.route('/updatelocation', methods = ['POST'])
def update_location():
    email = request.json['email']
    location = request.json['location']
    active_users[email] = {"location": location}
    return True

@app.route('/getportfolio', methods = ['POST'])
def get_portfolio():
    email = request.json['email']
    if email in active_users:
        return active_users[email]['portfolio']
    elif email in inactive_users:
        return inactive_users[email]['portfolio'] 
    return []


# TODO: ML routes (and corresponding user data routes to store toys and other info)
@app.route('/styletransfer', methods = ['POST'])
def transfer_style():
    url = request.json["image"]
    
    print ('[INFO] Reading the image')
    req = urlopen(url)
    arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
    img = cv.imdecode(arr, -1)
    print ('[INFO] Image Loaded successfully!')

    styled_loc, name = get_style_transfer(img)

    with open(styled_loc, "rb") as f:
        st_image = base64.b64encode(f.read())

    return jsonify(
        style_transfer=str(st_image)[2:-1],
        img_name=name +  url[url.rindex("/") + 1:url.index(".jp")]
    )
    

# TODO: NCR API routes (and corresponding user data routes)


# helper functions
def add_toy(email, toy):
    if email in active_users:
        portfolio = active_users[email]['portfolio'] # TODO: exact storage may change based on ML API
        portfolio.append(toy)
        active_users[email]['portfolio'] = portfolio
    elif email in inactive_users:
        portfolio = inactive_users[email]['portfolio']
        portfolio.append(toy)
        inactive_users[email]['portfolio'] = portfolio
    else:
        return False

    add_coupon(email)
    return True

def add_coupon(email):
    num = random.randint(0, 9)
    if num == 0:
        # add coupon
        coupon_choices = [{"name": "5% off next purchase!", "code": "1234"}, {"name": "Buy 1 get 1 free for any box of Kellogg's cereal!", "code": "1243"}]
        choice = random.randint(0, len(coupon_choices) - 1)
        coupon = coupon_choices[choice]
        if email in active_users:
            active_users[email]['coupons'].append(coupon)
        elif email in inactive_users:
            inactive_users[email]['coupons'].append(coupon)



# run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)
