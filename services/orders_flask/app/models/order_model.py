from app import db

class Order(db.Model):
    __tablename__ = 'Order'
    __table_args__ = {'schema': 'order'} 

    id = db.Column(db.Text, primary_key=True)
    description = db.Column(db.Text)
