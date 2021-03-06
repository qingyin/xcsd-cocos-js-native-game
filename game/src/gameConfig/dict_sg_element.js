var dict_sg_equation = {
    1:['1+0' , '2-1' , '5-4' , '6-5' , '3-2' , '7-6' , '8-7' , '9-8' , '10-9' , '4-3'],    
    2:['1+1' , '5-3' , '8-6' , '9-7' , '7-5' , '6-4' , '2+0' , '12-10' , '18-16' , '15-13'],   
    3:['0+3' , '6-3' , '1+2' , '3-0' , '4-1' , '23-20' , '7-4' , '10-7' , '9-6' , '18-15'],    
    4:['16-12' , '0+4' , '3+1' , '5-1' , '2+2' , '15-11' , '7-3' , '6-2' , '18-14' , '25-21'], 
    5:['5+0' , '10-5' , '8-3' , '6-1' , '2+3' , '9-4' , '4+1' , '32-27' , '24-19' , '16-11'],  
    6:['1+5' , '9-3' , '14-8' , '8-2' , '7-1' , '3+3' , '4+2' , '6+0' , '10-4' , '13-7'],  
    7:['4+3' , '13-6' , '10-3' , '5+2' , '3+4' , '6+1' , '9-2' , '0+7' , '8-1' , '21-14'], 
    8:['18-10' , '1+7' , '5+3' , '10-2' , '4+4' , '3+5' , '2+6' , '24-16' , '14-6' , '20-12'], 
    9:['7+2' , '18-9' , '9-0' , '3+6' , '8+1' , '2+7' , '4+5' , '15-6' , '23-14' , '32-23'],   
    10:['40-30' , '12-2' , '5+5' , '8+2' , '6+4' , '15-5' , '7+3' , '1+9' , '18-8' , '10+0'],
    11:['22-11' , '14-3' , '5+6' , '13-2' , '9+2' , '7+4' , '15-4' , '1+10' , '2+9' , '3+8'],   
    12:['8+4' , '18-6' , '3+9' , '16-4' , '6+6' , '5+7' , '19-7' , '0+12' , '11+1' , '2+10'],   
    13:['5+8' , '19-6' , '6+7' , '15-2' , '8+5' , '16-3' , '9+4' , '12+1' , '4+9' , '2+11'],  
    14:['6+8' , '15-1' , '7+7' , '8+6' , '18-4' , '9+5' , '16-2' , '3+11' , '24-10' , '16-2'],  
    15:['9+6' , '17-2' , '8+7' , '9+6' , '18-3' , '19-4' , '12+3' , '30-15' , '22-7' , '16-1'], 
    16:['8+8' , '19-3' , '8+8' , '13+3' , '18-2' , '20-4' , '11+5' , '4+12' , '7+9' , '6+10'],  
    17:['24-7' , '21-4' , '10+7' , '8+9' , '20-3' , '18-1' , '2+15' , '30-13' , '13+4' , '5+12'],   
    18:['27-9' , '30-12' , '9+9' , '6+12' , '19-1' , '13+5' , '11+7' , '5+13' , '10+8' , '2+16'],   
    19:['5+14' , '20-1' , '14+5' , '3+16' , '22-3' , '6+13' , '8+11' , '2+17' , '25-6' , '30-11'],  
    20:['11+9' , '22-2' , '15+5' , '25-5' , '18+2' , '29-9' , '28-8' , '13+7' , '6+14' , '2+18'],
    21:['20+1' , '18+3' , '26-5' , '13+8' , '15+6' , '7+14' , '21+0' , '25-4' , '29-8' , '22-1'],   
    22:['11+11' , '28-6' , '16+6' , '9+13' , '26-4' , '8+14' , '24-2' , '15+7' , '19+3' , '5+17'],  
    23:['25-2' , '19+4' , '13+10' , '26-3' , '17+6' , '5+18' , '14+9' , '11+12' , '30-7' , '28-5'], 
    24:['30-6' , '44-20' , '12+12' , '22+2' , '16+8' , '17+7' , '15+9' , '28-4' , '35-11' , '50-26'],   
    25:['18+7' , '14+11' , '15+10' , '29-4' , '22+3' , '16+9' , '27-2' , '30-5' , '28-3' , '50-25'],
}

var dict_sg_element = {
    '1' : {value:1,str:'A'},
    '2' : {value:2,str:'B'},
    '3' : {value:3,str:'C'},
    '4' : {value:4,str:'D'},
    '5' : {value:5,str:'E'},
    '6' : {value:6,str:'F'},
    '7' : {value:7,str:'G'},
    '8' : {value:8,str:'H'},
    '9' : {value:9,str:'I'},
    '10' : {value:10,str:'J'},
    '11' : {value:11,str:'K'},
    '12' : {value:12,str:'L'},
    '13' : {value:13,str:'M'},
    '14' : {value:14,str:'N'},
    '15' : {value:15,str:'O'},
    '16' : {value:16,str:'P'},
    '17' : {value:17,str:'Q'},
    '18' : {value:18,str:'R'},
    '19' : {value:19,str:'S'},
    '20' : {value:20,str:'T'},
    '21' : {value:21,str:'U'},
    '22' : {value:22,str:'V'},
    '23' : {value:23,str:'W'},
    '24' : {value:24,str:'X'},
    '25' : {value:25,str:'Y'},
    '26' : {value:26,str:'Z'},

    '127' : {value:1,str:'1'},
    '128' : {value:2,str:'2'},
    '129' : {value:3,str:'3'},
    '130' : {value:4,str:'4'},
    '131' : {value:5,str:'5'},
    '132' : {value:6,str:'6'},
    '133' : {value:7,str:'7'},
    '134' : {value:8,str:'8'},
    '135' : {value:9,str:'9'},
    '136' : {value:10,str:'10'},
    '137' : {value:11,str:'11'},
    '138' : {value:12,str:'12'},
    '139' : {value:13,str:'13'},
    '140' : {value:14,str:'14'},
    '141' : {value:15,str:'15'},
    '142' : {value:16,str:'16'},
    '143' : {value:17,str:'17'},
    '144' : {value:18,str:'18'},
    '145' : {value:19,str:'19'},
    '146' : {value:20,str:'20'},
    '147' : {value:21,str:'21'},
    '148' : {value:22,str:'22'},
    '149' : {value:23,str:'23'},
    '150' : {value:24,str:'24'},
    '151' : {value:25,str:'25'},
    '152' : {value:26,str:'26'},
    '153' : {value:27,str:'27'},
    '154' : {value:28,str:'28'},
    '155' : {value:29,str:'29'},
    '156' : {value:30,str:'30'},
    '157' : {value:31,str:'31'},
    '158' : {value:32,str:'32'},
    '159' : {value:33,str:'33'},
    '160' : {value:34,str:'34'},
    '161' : {value:35,str:'35'},
    '162' : {value:36,str:'36'},
    '163' : {value:37,str:'37'},
    '164' : {value:38,str:'38'},
    '165' : {value:39,str:'39'},
    '166' : {value:40,str:'40'},
    '167' : {value:41,str:'41'},
    '168' : {value:42,str:'42'},
    '169' : {value:43,str:'43'},
    '170' : {value:44,str:'44'},
    '171' : {value:45,str:'45'},
    '172' : {value:46,str:'46'},
    '173' : {value:47,str:'47'},
    '174' : {value:48,str:'48'},
    '175' : {value:49,str:'49'},
    '176' : {value:50,str:'50'},

    '53' : {value:1,str:'',equation:dict_sg_equation['1']},
    '54' : {value:2,str:'',equation:dict_sg_equation['2']},
    '55' : {value:3,str:'',equation:dict_sg_equation['3']},
    '56' : {value:4,str:'',equation:dict_sg_equation['4']},
    '57' : {value:5,str:'',equation:dict_sg_equation['5']},
    '58' : {value:6,str:'',equation:dict_sg_equation['6']},
    '59' : {value:7,str:'',equation:dict_sg_equation['7']},
    '60' : {value:8,str:'',equation:dict_sg_equation['8']},
    '61' : {value:9,str:'',equation:dict_sg_equation['9']},
    '62' : {value:10,str:'',equation:dict_sg_equation['10']},
    '63' : {value:11,str:'',equation:dict_sg_equation['11']},
    '64' : {value:12,str:'',equation:dict_sg_equation['12']},
    '65' : {value:13,str:'',equation:dict_sg_equation['13']},
    '66' : {value:14,str:'',equation:dict_sg_equation['14']},
    '67' : {value:15,str:'',equation:dict_sg_equation['15']},
    '68' : {value:16,str:'',equation:dict_sg_equation['16']},
    '69' : {value:17,str:'',equation:dict_sg_equation['17']},
    '70' : {value:18,str:'',equation:dict_sg_equation['18']},
    '71' : {value:19,str:'',equation:dict_sg_equation['19']},
    '72' : {value:20,str:'',equation:dict_sg_equation['20']},
    '73' : {value:21,str:'',equation:dict_sg_equation['21']},
    '74' : {value:22,str:'',equation:dict_sg_equation['22']},
    '75' : {value:23,str:'',equation:dict_sg_equation['23']},
    '76' : {value:24,str:'',equation:dict_sg_equation['24']},
    '77' : {value:25,str:'',equation:dict_sg_equation['25']},

}


