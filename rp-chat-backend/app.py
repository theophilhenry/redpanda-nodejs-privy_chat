from flask import Flask, Response, send_from_directory, request
from flask_cors import CORS, cross_origin
from kafka import KafkaProducer, KafkaConsumer
import os

from dotenv import load_dotenv
load_dotenv()

SASL_USERNAME = os.getenv('SASL_USERNAME')
SASL_PASSWORD = os.getenv('SASL_PASSWORD')
# REDPANDA_GROUP_ID = os.getenv('REDPANDA_GROUP_ID')
BOOTSTRAP_SERVERS = os.getenv('BOOTSTRAP_SERVERS')
TOPIC_NAME = os.getenv('TOPIC_NAME')

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/message', methods=['POST'])
def send_message():
    try:
        message = request.json
        producer = KafkaProducer(
                            bootstrap_servers=[BOOTSTRAP_SERVERS],
                            security_protocol='SASL_PLAINTEXT',
                            sasl_mechanism='SCRAM-SHA-512',
                            sasl_plain_username=SASL_USERNAME,
                            sasl_plain_password=SASL_PASSWORD
                            )
        producer.send(TOPIC_NAME, bytes(f'{message}','UTF-8'))
        producer.close()
        return message
    except Exception as err:
        print(f"Unexpected {err=}, {type(err)=}")
        return None

@app.route('/messages', methods=['GET'])
def get_messages():
    consumer = KafkaConsumer(TOPIC_NAME,
                            auto_offset_reset='earliest',
                            enable_auto_commit=False,
                            bootstrap_servers=BOOTSTRAP_SERVERS,
                            security_protocol='SASL_PLAINTEXT',
                            sasl_mechanism='SCRAM-SHA-512',
                            sasl_plain_username=SASL_USERNAME,
                            sasl_plain_password=SASL_PASSWORD,
                            # group_id=REDPANDA_GROUP_ID,
                            )
    def events():
        for message in consumer:
            try:
                yield 'data: {0}\n\n'.format(message.value.decode('utf-8'))
            except Exception as err:
                print(f"Unexpected {err=}, {type(err)=}")
    return Response(events(), mimetype="text/event-stream")

# app.run(host="0.0.0.0", port=4999)