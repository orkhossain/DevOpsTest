from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://sa:Password.2510@s127.0.0.1:1433/Order?driver=ODBC+Driver+18+for+SQL+Server'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
class Order(db.Model):
    id = db.Column(db.String(50), primary_key=True)
    description = db.Column(db.String(255))

@app.route('/orders', methods=['POST'])
def create_order():
    order_data = request.json
    order_id = order_data['id']
    order_description = order_data['description']

    new_order = Order(id=order_id, description=order_description)

    try:
        db.session.add(new_order)
        db.session.commit()
        return jsonify({'message': 'Order created'})

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/orders/<string:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get(id)

    if order:
        return jsonify({'id': order.id, 'description': order.description})
    else:
        return jsonify({'error': 'Order not found'}), 404

@app.route('/orders/<string:id>', methods=['PUT'])
def update_order(id):
    order = Order.query.get(id)

    if order:
        new_description = request.json['description']
        order.description = new_description

        try:
            db.session.commit()
            return jsonify({'message': 'Order updated'})

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Order not found'}), 404

@app.route('/orders/<string:id>', methods=['DELETE'])
def delete_order(id):
    order = Order.query.get(id)

    if order:
        try:
            db.session.delete(order)
            db.session.commit()
            return jsonify({'message': 'Order deleted'})

        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Order not found'}), 404

if __name__ == '__main__':
    db.create_all()
    app.run(host='0.0.0.0', port=5000)
