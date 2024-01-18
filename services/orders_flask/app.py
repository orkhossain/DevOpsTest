from flask import Flask, jsonify, request
from redis import Redis
import os

app = Flask(__name__)
redis = Redis.from_url(os.environ['REDIS_URL'])


@app.route('/tasks', methods=['POST'])
def create_task():
    task = request.json
    redis.set(task['id'], task['description'])
    return jsonify({'message': 'Task created'})


@app.route('/tasks/<string:id>', methods=['GET'])
def get_task(id):
    description = redis.get(id)
    if description is None:
        return jsonify({'error': 'Task not found'}), 404
    else:
        return jsonify({'id': id, 'description': description.decode()})


@app.route('/tasks/<string:id>', methods=['PUT'])
def update_task(id):
    description = request.json['description']
    if redis.exists(id):
        redis.set(id, description)
        return jsonify({'message': 'Task updated'})
    else:
        return jsonify({'error': 'Task not found'}), 404


@app.route('/tasks/<string:id>', methods=['DELETE'])
def delete_task(id):
    if redis.exists(id):
        redis.delete(id)
        return jsonify({'message': 'Task deleted'})
    else:
        return jsonify({'error': 'Task not found'}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
