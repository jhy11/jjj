import json
from channels.generic.websocket import AsyncWebsocketConsumer

import asyncio

from management.models import shop

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # different group name depends on shop
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
    
        # Join room group
        #https://channels.readthedocs.io/en/latest/topics/channel_layers.html
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        print('self.room_group_name: ',self.room_group_name)
        print('self.channel_layer: ',self.channel_layer)

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room goup
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        print('Disconnected!')
        

    # Receive message from WebSocket
    async def receive(self, text_data):
        receive_dict = json.loads(text_data)
        peer_username = receive_dict['peer']
        action = receive_dict['action']
        message = receive_dict['message']

        print('Message received: ', message)
        print('peer_username: ', peer_username)
        print('action: ', action)
        print('self.channel_name: ', self.channel_name)

        if(action == 'new-offer') or (action =='new-answer'):
            # in case its a new offer or answer
            # send it to the new peer or initial offerer respectively

            receiver_channel_name = receive_dict['message']['receiver_channel_name']

            print('Sending to ', receiver_channel_name)

            # set new receiver as the current sender
            receive_dict['message']['receiver_channel_name'] = self.channel_name

            await self.channel_layer.send(
                receiver_channel_name,
                {
                    'type': 'send.sdp',
                    'receive_dict': receive_dict,
                }
            )
       
            #await self.channel_layer.group_send(
            #    self.room_group_name,
            #    {
            #        'type': 'send.sdp',
            #        'receive_dict': receive_dict,
            #    }
            #)

            return

        # set new receiver as the current sender
        # so that some messages can be sent
        # to this channel specifically
        receive_dict['message']['receiver_channel_name'] = self.channel_name

        # send to all peers in the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send.sdp',
                'receive_dict': receive_dict,
            }
        )

    async def send_sdp(self, event):
        receive_dict = event['receive_dict']

        this_peer = receive_dict['peer']
        action = receive_dict['action']
        message = receive_dict['message']

        await self.send(text_data=json.dumps({
            'peer': this_peer,
            'action': action,
            'message': message,
        }))