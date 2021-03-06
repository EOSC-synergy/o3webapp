import enum
from bokeh.models import ColumnDataSource
from bokeh.core.property.color import Color

from flask import jsonify

# three plot types, default as tco3_zm = 1
class PlotType(enum.Enum):
   tco3_zm = 1
   vmro3_zm = 2
   tco3_return = 3

# three plot types, default as tco3_zm = 1
class OutputFormat(enum.Enum):
   json = 1
   pdf = 2
   csv = 3
   png = 4
   svg = 5

####################################################
# PlotData :
# --ptype
# --output
# --varData
# --modelData
####################################################
class PlotData:
    def __init__(self, ptype, varData, output):
        self.ptype = PlotType[ptype]
        print(output)
        self.output = OutputFormat[output]
        self.init_var_model_data(varData)

    def init_var_model_data(self, varData):
        #TODO move to PlotParser
        modeldata = varData['models']
        del varData['models']
        varData['model'] = [modelDict['model'] for modelDict in modeldata]
        self.varData = VarData(varData)
        self.modelData = Data(modeldata)

    def get_ptype(self):
        return self.ptype

    def get_ptype_name(self):
        return self.ptype.name

    def get_output(self):
        return self.output

    def get_output_format(self):
        return self.output.name

    def get_vardata(self):
        return self.varData

    def get_vardata_dict(self):
        return self.varData.get_dict()
    
    def get_modeldata(self):
        return self.modelData

    def get_modeldata_dict(self):
        return self.modelData.get_dict()

    def get_modeldata_list(self):
        return self.modelData.get_model_list()

    def print(self):
        print(self.ptype)
        print(self.varData)
        print(self.modelData)

class VarData:
    def __init__(self, varDataDict):
        self.varDataDict = varDataDict

    def get_dict(self):
        return self.varDataDict

    def __str__(self):
        return self.varDataDict.__str__()

class Data:
    def __init__(self, modeldata):
        self.modelDict = {}
        self.set_para_in_modelDict(modeldata)

    def get_dict(self):
        return self.modelDict

    def get_model_list(self):
        return list(self.modelDict.values())

    def get_model(self, modelName):
        return self.modelDict[modelName]

    def add_model(self, model):
        modelName = model.get_name()
        self.modelDict[modelName] = model

    def set_para_in_modelDict(self, paraArr):
        #TODO move to PlotParser
        # TODO name of the dimensions needed
        for para in paraArr:
            self.add_model(Model(para['model'],"x","y",para['style']))

    # add val into the existing models,
    # assuming that all the models have been initialized 
    # by setting para from user-request
    def set_val_in_modelDict(self, dataArr):
        #TODO move to PlotParser
        for data in dataArr:
            self.modelDict[data["model"]].set_val_cds(data)

    def __str__(self):
        dataStr = "{"
        for k, v in self.modelDict.items():
            dataStr += k + ":" + v.__str__() + ","
        return  dataStr[:-1] + "}"

#################################################
# climate model : 
# --vals : [coordX, coordY]
#          {val1X : val1Y,
#           val2X : val2Y, ...}
# --paras :
#################################################
class Model:
    defaultX = "x"
    defaultY = "y"

    def __init__(self, modelName, coordX, coordY, paraDict):
        self.name = modelName
        self.val = ModelVal(coordX, coordY)
        self.para = ModelPara(paraDict)

    def get_name(self):
        return self.name

    def get_val_coord(self):
        return self.val.get_coord()

    def get_val_cds(self):
        return self.val.get_cds()

    def set_val_cds(self, valDict):
        arrayX = valDict[Model.defaultX]
        arrayY = valDict[Model.defaultY]
        self.val.set_cds(arrayX, arrayY)

    def get_para(self):
        return self.para

    def get_para_color(self):
        return self.para.get_color()

    def get_para_highlighted(self):
        return self.para.get_highlighted()

    def __str__(self):
        return "{val: " + self.val.__str__() + ", " + \
               "para: " + self.para.__str__() + "}"

class ModelVal:
    def __init__(self, coordX, coordY):
        #TODO replace cds by pd.dataframe
        self.cds = ColumnDataSource({coordX:[], coordY:[]})

    def get_coord(self):
        return list(self.cds.data.keys())

    def get_cds(self):
        return self.cds.data

    def set_cds(self, arrayX, arrayY):
        cName = self.get_coord()
        dataXY = {cName[0]: arrayX, cName[1]: arrayY}
        self.cds.stream(dataXY)

    def __str__(self):
        return self.cds.to_json_string(False)
                
class ModelPara:
    def __init__(self, paraDict):
        # TODO bokeh type for style
        self.color = Color()
        self.color = paraDict['color']
        # self.color = "#a240a2"
        # self.color = (100, 100, 255)
        # self.color = (100, 100, 255, 0.5)
        self.highlighted = paraDict['highlighted']
        # TODO hatch style


    def get_color(self):
        return self.color

    def get_highlighted(self):
        return self.highlighted

    def __str__(self):
        return "{color: " + self.color + ", " + \
               "highlighted: " + self.highlighted + "}"