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
active_users = {"ragarwal84@gatech.edu": {"location": {"latitude": 33.7766764817335, "longitude": -84.396}, "portfolio": [], "promos": [], "store": "lala"}}
inactive_users = {}


# ------

@app.route('/')
def home():
    return "Why are you here? You shouldn't be here. Klaus is watching you."

# user data routes
@app.route('/adduser', methods = ['POST'])
def add_user():
    print("Adduser:")
    email = request.json['email']
    store = request.json['store']
    print(email, store)
    user = inactive_users.pop(email, {"location": None, "portfolio": [], "promos": [], "store": store})
    print(user)
    active_users[email] = user
    print(active_users)

@app.route('/removeuser', methods = ['POST'])
def remove_user():
    print("removeuser:")
    email = request.json['email']
    print(email)
    user = active_users.pop(email, {"location": None, "portfolio": [], "promos": [], "store": None})
    print(user)
    user['store'] = None
    inactive_users[email] = user
    print(inactive_users)

@app.route('/updatelocation', methods = ['POST'])
def update_location():
    email = request.json['email']
    location = request.json['location']
    active_users[email] = {"location": location}

@app.route('/getportfolio', methods = ['POST'])
def get_portfolio():
    email = request.json['email']
    print("GET PORTFOLIO")
    print(email)
    print(active_users)
    print(inactive_users)
    if email in active_users:
        return {"res": active_users[email]['portfolio']}
    elif email in inactive_users:
        return {"res": inactive_users[email]['portfolio']}
    return {"res": []}

@app.route('/getcoupons', methods = ['POST'])
def get_coupons():
    email = request.json['email']
    if email in active_users:
        return {"res": active_users[email]['promos']}
    elif email in inactive_users:
        return {"res": inactive_users[email]['promos']}
    return {"res": []}

@app.route('/getlocations', methods = ['POST'])
def get_locations():
    store = request.json['store']
    locations = []
    for email, data in active_users.items():
        if data['store'] == store:
            locations.append(data['location'])
    return {"res": locations}

@app.route('/deletecoupon', methods = ['POST'])
def delete_coupon():
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



# TODO: ML routes (and corresponding user data routes to store toys and other info)
@app.route('/styletransfer', methods = ['POST'])
def transfer_style():
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

    print("ACTIVE USERS: ")
    print(active_users)
    print("INACTIVE USERS: ")
    print(inactive_users)

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
    
    return jsonify(
        style_transfer=new_img,
        img_name=n
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
    app.run(host="0.0.0.0")