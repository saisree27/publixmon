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
import string

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
    if email in active_users:
        active_users[email]['location'] = location
    elif email in inactive_users:
        inactive_users[email]['location'] = location
    else:
        print("Something's wrong.")

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
        coupons = active_users[email]['promos']
        new_coupons = list(filter(lambda x: x['code'] != code, coupons))
        active_users[email]['promos'] = new_coupons
    elif email in inactive_users:
        coupons = inactive_users[email]['promos']
        new_coupons = list(filter(lambda x: x['code'] != code, coupons))
        inactive_users[email]['promos'] = new_coupons

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

        new_toy = {"name": n, "image": new_img, "id": ''.join(random.choice(string.ascii_lowercase) for _ in range(10))}

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
def add_toy(email, toy):
    if email in active_users:
        portfolio = active_users[email]['portfolio'] # TODO: exact storage may change based on ML API
        portfolio.append(toy)
        active_users[email]['portfolio'] = portfolio
    elif email in inactive_users:
        portfolio = inactive_users[email]['portfolio']
        portfolio.append(toy)
        inactive_users[email]['portfolio'] = portfolio


@app.route('/swap', methods = ['POST'])
def swap():
    user_email = request.json["user"]
    email_to_swap = request.json["email"]
    id_to_send = request.json["lose"]
    id_to_receive = request.json["get"]

    active_users = get_active_users()
    inactive_users = get_inactive_users()

    user_active = False
    other_active = False
    user_send_loc = -1
    other_send_loc = -1

    if user_email in active_users:
        user_active = True
        for i in range(len(active_users[user_email]["portfolio"])):
            if active_users[user_email]["portfolio"][i]["id"] == id_to_send:
                user_send_loc = i
    elif user_email in inactive_users:
        for i in range(len(inactive_users[user_email]["portfolio"])):
            if inactive_users[user_email]["portfolio"][i]["id"] == id_to_send:
                user_send_loc = i
    else:
        return jsonify(
            res="Invalid user email"
        )

    if user_send_loc == -1:
        return jsonify(
            res="Invalid send id"
        )

    if email_to_swap in active_users:
        other_active = True
        for i in range(len(active_users[email_to_swap]["portfolio"])):
            if active_users[email_to_swap]["portfolio"][i]["id"] == id_to_receive:
                other_send_loc = i
    elif email_to_swap in inactive_users:
        for i in range(len(inactive_users[email_to_swap]["portfolio"])):
            if inactive_users[email_to_swap]["portfolio"][i]["id"] == id_to_receive:
                other_send_loc = i
    else:
        return jsonify(
            res="Invalid other email"
        )

    if other_send_loc == -1:
        return jsonify(
            res="Invalid other id"
        )

    if user_active and other_active:
        active_users[user_email]["portfolio"][user_send_loc], active_users[email_to_swap]["portfolio"][other_send_loc] = active_users[email_to_swap]["portfolio"][other_send_loc], active_users[user_email]["portfolio"][user_send_loc]
    elif user_active and not other_active:
        active_users[user_email]["portfolio"][user_send_loc], inactive_users[email_to_swap]["portfolio"][other_send_loc] = inactive_users[email_to_swap]["portfolio"][other_send_loc], active_users[user_email]["portfolio"][user_send_loc]
    elif not user_active and other_active:
        inactive_users[user_email]["portfolio"][user_send_loc], active_users[email_to_swap]["portfolio"][other_send_loc] = active_users[email_to_swap]["portfolio"][other_send_loc], inactive_users[user_email]["portfolio"][user_send_loc]
    else:
        inactive_users[user_email]["portfolio"][user_send_loc], inactive_users[email_to_swap]["portfolio"][other_send_loc] = inactive_users[email_to_swap]["portfolio"][other_send_loc], inactive_users[user_email]["portfolio"][user_send_loc]

    set_inactive_users(inactive_users)
    set_active_users(active_users)

    return jsonify(
        res="success"
    )
# helper functions

def add_coupon(email):
    active_users = get_active_users()
    inactive_users = get_inactive_users()

    num = random.randint(0, 9)
    if num < 8:
        # add coupon
        coupon_choices = [{"name": "5% off next purchase!", "code": "1234"}, {"name": "Buy 1 get 1 free for any box of Kellogg's cereal!", "code": "1243"}]
        choice = random.randint(0, len(coupon_choices) - 1)
        coupon = coupon_choices[choice]
        if email in active_users:
            active_users[email]['promos'].append(coupon)
        elif email in inactive_users:
            inactive_users[email]['promos'].append(coupon)

    set_active_users(active_users)
    set_inactive_users(inactive_users)


# run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)
    app.run(host="0.0.0.0")
