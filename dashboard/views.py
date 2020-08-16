from typing import List
from django.shortcuts import HttpResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import json
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.serializers.json import DjangoJSONEncoder


@csrf_exempt
@api_view(['POST'])
def populateBrand(request):
    cur = connection.cursor()
    query = """
    SELECT DISTINCT brand FROM digi1.digi1_product;
    """
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    return Response(results)


@csrf_exempt
@api_view(['POST'])
def populateL1(request):
    # data = json.loads(request.body)
    # brand = data["brand"]
    cur = connection.cursor()
    query = """
    SELECT DISTINCT L1 FROM digi1.digi1_product where L1 is not null ;
    """
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    return Response(results)


@csrf_exempt
def populateL2(request):
    data = json.loads(request.body)  # string to json

    brand = data["brand"]
    L1 = data["L1"]
    cur = connection.cursor()
    query = """
    SELECT DISTINCT L2 FROM digi1.digi1_product where L1 = '%s' and L2 is not null;
    """ % (L1)
    cur.execute(query)
    results = cur.fetchall()
    cur.close()
    return HttpResponse(json.dumps(results))  # json to string


@csrf_exempt
def populateL3(request):
    data = json.loads(request.body)
    brand = data["brand"]
    L1 = data["L1"]
    L2 = data['L2']
    cur = connection.cursor()
    query = """
    SELECT DISTINCT L3 FROM digi1.digi1_product where L1 = '%s' and L2 = '%s' and L3 is not null;
    """ % (L1, L2)
    cur.execute(query)

    results = cur.fetchall()
    cur.close()

    return HttpResponse(json.dumps(results))  # json to string


@csrf_exempt
def populateResult(request):
    data = json.loads(request.body)
    brand = data["brand"]
    L1 = data["L1"]
    L2 = data["L2"]
    L3 = data["L3"]
    date = data["date"]
    Llimit = data["Llimit"]
    Ulimit = data["Ulimit"]
    Oos = data["Oos"]

    cur = connection.cursor()
    query = "call ecomp_intel.get_current_prices('%s', '%s', '%s', '%s','%s', '%s', '%s','%s');" % (
        brand, L1, L2, L3, date, Llimit, Ulimit, Oos)
    print("query", query)
    cur.execute(query)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))

    return HttpResponse(json.dumps(json_data))


@csrf_exempt
def populatePriceDrop(request):
    data = json.loads(request.body)
    brand = data["brand"]
    L1 = data["L1"]
    L2 = data["L2"]
    L3 = data["L3"]
    date = data["date"]
    Llimit = data["Llimit"]
    Ulimit = data["Ulimit"]
    Oos = data["Oos"]

    cur = connection.cursor()
    query = "call ecomp_intel.price_drop('%s', '%s', '%s', '%s','%s', '%s', '%s','%s');" % (
        brand, L1, L2, L3, date, Llimit, Ulimit, Oos)
    print("query", query)
    cur.execute(query)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))

    return HttpResponse(json.dumps(json_data))


@csrf_exempt
@api_view(['POST'])
def priceHistory(request):
    data = json.loads(request.body)
    comp_name = data["comp_name"]
    sku_id = data["sku_id"]
    cur = connection.cursor()
    query = "call ecomp_intel.price_history('%s', '%s');" % (comp_name, sku_id)
    cur.execute(query)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))

    return HttpResponse(json.dumps(json_data, cls=DjangoJSONEncoder))


@csrf_exempt
@api_view(['POST'])
def priceTrendHistory(request):
    data = json.loads(request.body)
    sku_id = data["sku_id"]
    cur = connection.cursor()
    query = "call ecomp_intel.price_trend_history('%s');" % (sku_id)
    print(query)
    cur.execute(query)
    result = cur.fetchall()
    print(result)
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))

    return HttpResponse(json.dumps(json_data, cls=DjangoJSONEncoder))


@csrf_exempt
@api_view(['POST'])
def top10(request):
    data = json.loads(request.body)
    brand = data["brand"]
    category = data["L1"]
    cur = connection.cursor()
    query = "call ecomp_intel.top_10_products('%s','%s');" % (brand, category)
    cur.execute(query)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))

    return HttpResponse(json.dumps(json_data, cls=DjangoJSONEncoder))


@csrf_exempt
@api_view(['POST'])
def worst10(request):
    data = json.loads(request.body)
    brand = data["brand"]
    category = data["L1"]
    cur = connection.cursor()
    query = "call ecomp_intel.worst_10_products('%s','%s');" % (
        brand, category)
    cur.execute(query)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))

    return HttpResponse(json.dumps(json_data, cls=DjangoJSONEncoder))


@csrf_exempt
@api_view(['POST'])
def discount_grid(request):
    data = json.loads(request.body)
    brand = data["brand"]
    Oos = data["Oos"]
    L1 = data["L1"]
    L2 = data["L2"]
    L3 = data["L3"]
    date = data["date"]
    Llimit = data["Llimit"]
    Ulimit = data["Ulimit"]

    cur = connection.cursor()
    query = "call digi1.get_discount_grid('%s','%s','%s','%s','%s','%s','%s','%s');" % (
        brand, Oos, L1, L2, L3, date, Llimit, Ulimit)
    cur.execute(query)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))

    return HttpResponse(json.dumps(json_data, cls=DjangoJSONEncoder))


@csrf_exempt
@api_view(['POST'])
def discount_grid_detail(request):
    data = json.loads(request.body)
    brand = data["brand"]
    Oos = data["Oos"]
    L1 = data["L1"]
    L2 = data["L2"]
    L3 = data["L3"]
    date = data["date"]
    Llimit = data["Llimit"]
    Ulimit = data["Ulimit"]
    discount = data["discount"]
    comp = data["comp"]

    cur = connection.cursor()
    query = "call digi1.discount_grid_sku('%s','%s','%s','%s','%s','%s','%s','%s','%s','%s');" % (
        brand, Oos, L1, L2, L3, date, Llimit, Ulimit, discount, comp)
    cur.execute(query)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))

    return HttpResponse(json.dumps(json_data, cls=DjangoJSONEncoder))

# LCH Report
@csrf_exempt
@api_view(['POST'])
def populateLCH(request):
    data = json.loads(request.body)
    brand = data["brand"]
    L1 = data["L1"]
    L2 = data["L2"]
    L3 = data["L3"]
    date = data["date"]
    Llimit = data["Llimit"]
    Ulimit = data["Ulimit"]
    udelta = data["udelta"]

    cur = connection.cursor()
    query = "call digi1.get_lch(%s, %s, %s, %s, %s, %s, %s, %s);"
    params = (
        int(udelta), brand, L1, L2, L3, date, int(Llimit), int(Ulimit))
    # print("query", query)
    cur.execute(query, params)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))
    return Response(json.dumps(json_data))


@csrf_exempt
@api_view(['POST'])
def populateLCH_Sku(request):
    data = json.loads(request.body)
    brand = data["brand"]
    L1 = data["L1"]
    L2 = data["L2"]
    L3 = data["L3"]
    date = data["date"]
    Llimit = data["Llimit"]
    Ulimit = data["Ulimit"]
    uLCH = data["uLCH"]
    udelta = data["udelta"]

    cur = connection.cursor()
    query = "call digi1.get_lch_sku(%s, %s, %s, %s, %s, %s, %s, %s, %s);"
    params = (
        int(udelta), brand, L1, L2, L3, date, int(Llimit), int(Ulimit), uLCH)
    # print("query", query)
    cur.execute(query, params)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))
    return Response(json.dumps(json_data))
