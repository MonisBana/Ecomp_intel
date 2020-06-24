from django.shortcuts import HttpResponse
from django.db import connection
from django.views.decorators.csrf import csrf_exempt
import json


@csrf_exempt
def populateBrand(request):
    cur = connection.cursor()
    query = """
    SELECT DISTINCT brand FROM digi1.digi1_product;
    """
    cur.execute(query)
    results = cur.fetchall()
    # final_data = []
    # for row in results:
    #     final_data.append(row[0])
    return HttpResponse(json.dumps(results))


@csrf_exempt
def populateL1(request):
    data = json.loads(request.body)
    brand = data["brand"]
    cur = connection.cursor()
    query = """
    SELECT DISTINCT L1 FROM digi1.digi1_product WHERE brand = '%s';
    """ % (brand)
    cur.execute(query)
    results = cur.fetchall()
    final_data = []
    for row in results:
        final_data.append(row[0])

    return HttpResponse(json.dumps(final_data))


@csrf_exempt
def populateL2(request):
    data = json.loads(request.body)  # string to json

    brand = data["brand"]
    L1 = data["L1"]
    cur = connection.cursor()
    query = """
    SELECT DISTINCT L2 FROM digi1.digi1_product where brand = '%s' and L1 = '%s';
    """ % (brand, L1)
    cur.execute(query)
    results = cur.fetchall()
    final_data = []
    for row in results:
        final_data.append(row[0])

    return HttpResponse(json.dumps(final_data))  # json to string


@csrf_exempt
def populateL3(request):
    data = json.loads(request.body)
    brand = data["brand"]
    L1 = data["L1"]
    L2 = data['L2']
    cur = connection.cursor()
    query = """
    SELECT DISTINCT L3 FROM digi1.digi1_product where brand = '%s' and L1 = '%s' and L2 = '%s';
    """ % (brand, L1, L2)
    cur.execute(query)

    results = cur.fetchall()
    final_data = []
    for row in results:
        final_data.append(row[0])

    return HttpResponse(json.dumps(final_data))  # json to string


@csrf_exempt
def populateResult(request):
    data = json.loads(request.body)
    brand = data["brand"]
    L1 = data["L1"]
    L2 = data["L2"]
    L3 = data["L3"]
    date = data["date"]
    print("date", date)
    cur = connection.cursor()
    query = """
SELECT 
    dp.sku_id,
    (SELECT 
            amz.price
        FROM
            ecomp_intel.amazon_price amz
        WHERE
            amz.asin = dp.asin AND amz.dt = '%s') amz_price,
    (SELECT 
            fkt.price
        FROM
            ecomp_intel.fkt_price fkt
        WHERE
            fkt.fid = dp.fid AND fkt.dt = '%s') fkt_price,
    (SELECT 
            cr.price
        FROM
            ecomp_intel.croma_price cr
        WHERE
            cr.sku_id = dp.sku_id AND cr.dt = '%s') cr_price,
    (SELECT 
            rd.price
        FROM
            ecomp_intel.rd_price rd
        WHERE
            rd.rid = dp.rid AND rd.dt = '%s') rd_price,
    (SELECT 
            sd.price
        FROM
            ecomp_intel.sd_price sd
        WHERE
            sd.supc = dp.sid AND sd.dt = '%s') sd_price        
FROM
    digi1.digi1_product dp
    
    where dp.Brand='%s' and dp.L1='%s' and dp.L2='%s' and dp.L3='%s';
    """ % (date, date, date, date, date, brand, L1, L2, L3)

    cur.execute(query)
    result = cur.fetchall()
    row_headers = [x[0] for x in cur.description]
    cur.close()
    json_data = []
    for row in result:
        json_data.append(dict(zip(row_headers, row)))

    return HttpResponse(json.dumps(json_data))


'''
@csrf_exempt
def populateChart(request):
    pass
    # graph = fig.to_html(full_html=False, default_height=500, default_width=700)
    # context = {'graph': graph}
    # x_data = [0, 1, 2, 3]
    # y_data = [x**2 for x in x_data]
    # plot_div = plot([Scatter(x=x_data, y=y_data,
    #                          mode='lines', name='test',
    #                          opacity=0.8, marker_color='green')],
    #                 output_type='div')
    # return render(request, 'Home.html', context)


'''
# @csrf_exempt
# def populateChart(request):
#     data = json.loads(request.body)  # string to json
#     udata = data["udata"]
#     cur = connection.cursor()
#     query = """
#     call training.get_chart_data(%s);
#     """ % (udata["sku_id"])
#     cur.execute(query)
#     results = cur.fetchall()
#     row_headers = [x[0] for x in cur.description]
#     cur.close()
#     final_data = []
#     for row in results:
#         final_data.append(dict(zip(row_headers, row)))
#     print("#######", final_data)
#     return HttpResponse(json.dumps(final_data))  # json to string
