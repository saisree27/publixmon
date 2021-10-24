from flask import Flask
from flask import request, jsonify
import random
import base64
import numpy as np
import cv2 as cv
from style_transfer import data_uri_to_cv2_img, get_style_transfer
import requests
from urllib.request import urlopen
import json
import random

app = Flask(__name__)

# LIVE APP DATA FOR PROOF-OF-CONCEPT
# ------
def get_active_users():
    with open('active_users.txt') as f:
        return json.load(f)

def get_inactive_users():
    with open('inactive_users.txt') as f:
        return json.load(f)

def set_active_users(users_dict):
    with open('active_users.txt', 'w') as f:
        json.dump(users_dict, f)

def set_inactive_users(users_dict):
    with open('inactive_users.txt', 'w') as f:
        json.dump(users_dict, f)


# ------

@app.route('/')
def home():
    return "Why are you here? You shouldn't be here. Klaus is watching you."

# user data routes
@app.route('/adduser', methods = ['POST'])
def add_user():
    active_users = get_active_users()
    inactive_users = get_inactive_users()

    email = request.json['email']
    store = request.json['store']
    user = inactive_users.pop(email, {"location": None, "portfolio": [], "promos": [], "store": store})
    active_users[email] = user
    
    set_active_users(active_users)
    set_inactive_users(inactive_users)

@app.route('/removeuser', methods = ['POST'])
def remove_user():
    active_users = get_active_users()
    inactive_users = get_inactive_users()

    email = request.json['email']
    user = active_users.pop(email, {"location": None, "portfolio": [], "promos": [], "store": None})
    user['store'] = None
    inactive_users[email] = user

    set_active_users(active_users)
    set_inactive_users(inactive_users)

@app.route('/updatelocation', methods = ['POST'])
def update_location():
    active_users = get_active_users()
    inactive_users = get_inactive_users()

    email = request.json['email']
    location = request.json['location']
    active_users[email]['location'] = location

    set_active_users(active_users)
    set_inactive_users(inactive_users)

@app.route('/getportfolio', methods = ['POST'])
def get_portfolio():
    active_users = get_active_users()
    inactive_users = get_inactive_users()

    email = request.json['email']

    set_active_users(active_users)
    set_inactive_users(inactive_users)
    if email in active_users:
        return {"res": active_users[email]['portfolio']}
    elif email in inactive_users:
        return {"res": inactive_users[email]['portfolio']}
    return {"res": []}

@app.route('/getcoupons', methods = ['POST'])
def get_coupons():
    active_users = get_active_users()
    inactive_users = get_inactive_users()

    email = request.json['email']
    if email in active_users:
        return {"res": active_users[email]['promos']}
    elif email in inactive_users:
        return {"res": inactive_users[email]['promos']}
    return {"res": []}

@app.route('/getlocations', methods = ['POST'])
def get_locations():
    active_users = get_active_users()
    inactive_users = get_inactive_users()

    store = request.json['store']
    locations = []
    for email, data in active_users.items():
        if data['store'] == store:
            locations.append(data['location'])
    
    return {"res": locations}

@app.route('/deletecoupon', methods = ['POST'])
def delete_coupon():
    active_users = get_active_users()
    inactive_users = get_inactive_users()

    email = request.json['email']
    code = request.json['code']
    if email in active_users:
        coupons = active_users[email]['coupons']
        new_coupons = list(filter(lambda x: x['code'] != code, coupons))
        active_users[email]['coupons'] = new_coupons
    elif email in inactive_users:
        coupons = inactive_users[email]['coupons']
        new_coupons = list(filter(lambda x: x['code'] != code, coupons))
        inactive_users[email]['coupons'] = new_coupons

    set_active_users(active_users)
    set_inactive_users(inactive_users)


# TODO: ML routes (and corresponding user data routes to store toys and other info)
@app.route('/styletransfer', methods = ['POST'])
def transfer_style():
    if random.random() < 0.5:
        active_users = get_active_users()
        inactive_users = get_inactive_users()

        url = request.json["image"]
        email = request.json["email"]

        print ('[INFO] Reading the image')
        req = urlopen(url)
        arr = np.asarray(bytearray(req.read()), dtype=np.uint8)
        img = cv.imdecode(arr, -1)
        print ('[INFO] Image Loaded successfully!')

        styled_loc, name = get_style_transfer(img)

        with open(styled_loc, "rb") as f:
            st_image = base64.b64encode(f.read())

        new_img = str(st_image)[2:-1]
        n = name +  url[url.rindex("/") + 1:url.index(".jp")]

        new_toy = {"name": n, "image": new_img}

        if email in active_users:
            portfolio = active_users[email]['portfolio'] # TODO: exact storage may change based on ML API
            portfolio.append(new_toy)
            active_users[email]['portfolio'] = portfolio
        elif email in inactive_users:
            portfolio = inactive_users[email]['portfolio']
            portfolio.append(new_toy)
            inactive_users[email]['portfolio'] = portfolio
        else:
            print("This doesn't make sense. The email does not exist!")
        
        set_active_users(active_users)
        set_inactive_users(inactive_users)

        add_coupon(email)

        return jsonify(
            style_transfer=new_img,
            img_name=n
        )
    print("User didn't win anything.")
    return jsonify(img_name="NONE")

# TODO: NCR API routes (and corresponding user data routes)

# helper functions

def add_coupon(email):
    active_users = get_active_users()
    inactive_users = get_inactive_users()

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

    set_active_users(active_users)
    set_inactive_users(inactive_users)


# run the app
if __name__ == '__main__':
    app.run(host="0.0.0.0")
