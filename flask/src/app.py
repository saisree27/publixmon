from flask import Flask
from flask import request, jsonify
import random

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
        coupon_choices = ["5% off next purchase!", "$2 off any purchase of $10 or more!", "Spend $75 or more and get $10 back!", "Buy 1 get 1 free for any box of cereal!"]
        choice = random.randint(0, len(coupon_choices) - 1)
        coupon = coupon_choices[choice]
        if email in active_users:
            active_users[email]['coupons'].append(coupon)
        elif email in inactive_users:
            inactive_users[email]['coupons'].append(coupon)



# run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)