"""
@author: liyao
@contact: liyao2598330@126.com
@time: 2020/8/16 4:52 下午
"""

import time
import datetime

from django.http import HttpResponse
try:
    from django.shortcuts import reverse
except ImportError:
    from django.core.urlresolvers import reverse


def try_safe_eval(value):
    value = str(value)
    if all([value]):
        if value.startswith('[') and value.endswith(']') or \
                value.startswith('{') and value.endswith('}'):
            value = eval(value, {'datetime': datetime, 'time': time})

        elif value.lower() in ['true', 'false']:
            return {
                'true': True,
                'false': False,
            }.get(value.lower())

    return value


def handle_pass_list(url_or_url_name_list):
    """
        reverse django url name
    :param url_or_url_name_list:
    :return:
    """
    assert isinstance(url_or_url_name_list, list), 'parameter type must be list'

    response = []
    for u in url_or_url_name_list:
        try:
            u = reverse(u)
            if u not in response:
                response.append(u)
        except:
            if u not in response:
                response.append(u)

    return response


def default_response():
    """
        Must return django HttpResponse type
    :return: HttpResponse
    """
    return HttpResponse()
