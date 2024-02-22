from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql+psycopg2://user:password@postgres:5432/orders'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Order(db.Model):
    __tablename__ = 'Order'
    __table_args__ = {'schema': 'public'} 

    id = db.Column(db.Text, primary_key=True)
    description = db.Column(db.Text)
    
@app.route('/orders', methods=['POST'])
def create_order():
    try:
        order_data = request.get_json()
        order_id = order_data.get('id')
        order_description = order_data.get('description')

        if not order_id or not order_description:
            raise ValueError('Missing order ID or description')

        new_order = Order(id=order_id, description=order_description)
        db.session.add(new_order)
        db.session.commit()

        return jsonify({'message': 'Order created'}), 201
    except (KeyError, ValueError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/orders/<string:id>', methods=['GET'])
def get_order(id):
    order = Order.query.get(id)
    if order:
        return jsonify({'id': order.id, 'description': order.description})
    return jsonify({'error': 'Order not found'}), 404

@app.route('/orders/<string:id>', methods=['PUT'])
def update_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        order_data = request.get_json()
        new_description = order_data.get('description')

        if not new_description:
            raise ValueError('Missing description')

        order.description = new_description
        db.session.commit()
        return jsonify({'message': 'Order updated'})
    except (KeyError, ValueError) as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/orders/<string:id>', methods=['DELETE'])
def delete_order(id):
    try:
        order = Order.query.get(id)
        if not order:
            return jsonify({'error': 'Order not found'}), 404

        db.session.delete(order)
        db.session.commit()
        return jsonify({'message': 'Order deleted'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
