from flask import Flask
from flask import request, jsonify

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
    user = inactive_users.pop(email, {})
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
    active_users[email] = {location: location}
    return True



# TODO: ML routes (and corresponding user data routes to store toys and other info)

# TODO: NCR API routes (and corresponding user data routes)

# helper functions
def calculate_portfolio_score(email):
    portfolio = []
    if email in active_users:
        portfolio = active_users[email][portfolio]
    elif email in inactive_users:
        portfolio = inactive_users[email][portfolio]
    else:
        return 0
    types = {} # TODO: exact naming may change based on NCR API
    count = 0
    for item in portfolio:
        types[item['type']] = True
        count += 1
    return count * len(types.items()) # calculate score on portfolio size and variety

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
    return True


# run the app
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=105)