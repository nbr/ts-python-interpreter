/*
 Refactoring per enum tip by @jvilk
 */

export enum PyType{
    TYPE_NULL,
    TYPE_NONE,
    TYPE_FALSE,
    TYPE_TRUE,
    TYPE_STOPITER,
    TYPE_ELLIPSIS,
    TYPE_INT,
    TYPE_INT64,
    TYPE_FLOAT,
    TYPE_BINARY_FLOAT,
    TYPE_COMPLEX,
    TYPE_BINARY_COMPLEX,
    TYPE_LONG,
    TYPE_STRING,
    TYPE_INTERNED,
    TYPE_STRINGREF,
    TYPE_UNICODE,
    TYPE_TUPLE,
    TYPE_LIST,
    TYPE_DICT,
    TYPE_FROZENSET,
    TYPE_CODE,
    TYPE_ERROR
}

export enum PyErrorType{
    TypeError
}

export enum OpList {
    STOP_CODE,                          //0
    POP_TOP,                            //1
    ROT_TWO,                            //2
    ROT_THREE,                          //3
    DUP_TOP,                            //4
    ROT_FOUR,                           //5
    undefined,                          //6
    undefined,                          //7
    undefined,                          //8
    NOP,                                //9
    UNARY_POSITIVE,                     //10
    UNARY_NEGATIVE,                     //11
    UNARY_NOT,                          //12
    undefined,                          //13
    undefined,                          //14
    undefined,                          //15
    undefined,                          //16
    undefined,                          //17
    undefined,                          //18
    undefined,                          //19
    undefined,                          //20
    undefined,                          //21
    undefined,                          //22
    undefined,                          //23
    undefined,                          //24
    undefined,                          //25
    undefined,                          //26
    undefined,                          //27
    undefined,                          //28
    undefined,                          //29
    undefined,                          //30
    undefined,                          //31
    undefined,                          //32
    undefined,                          //33
    undefined,                          //34
    undefined,                          //35
    undefined,                          //36
    undefined,                          //37
    undefined,                          //38
    undefined,                          //39
    undefined,                          //40
    undefined,                          //41
    undefined,                          //42
    undefined,                          //43
    undefined,                          //44
    undefined,                          //45
    undefined,                          //46
    undefined,                          //47
    undefined,                          //48
    undefined,                          //49
    undefined,                          //50
    undefined,                          //51
    undefined,                          //52
    undefined,                          //53
    undefined,                          //54
    undefined,                          //55
    undefined,                          //56
    undefined,                          //57
    undefined,                          //58
    undefined,                          //59
    undefined,                          //60
    undefined,                          //61
    undefined,                          //62
    undefined,                          //63
    undefined,                          //64
    undefined,                          //65
    undefined,                          //66
    undefined,                          //67
    undefined,                          //68
    undefined,                          //69
    undefined,                          //70
    undefined,                          //71
    undefined,                          //72
    undefined,                          //73
    undefined,                          //74
    undefined,                          //75
    undefined,                          //76
    undefined,                          //77
    undefined,                          //78
    undefined,                          //79
    undefined,                          //80
    undefined,                          //81
    undefined,                          //82
    undefined,                          //83
    undefined,                          //84
    undefined,                          //85
    undefined,                          //86
    undefined,                          //87
    undefined,                          //88
    undefined,                          //89
    undefined,                          //90
    undefined,                          //91
    undefined,                          //92
    undefined,                          //93
    undefined,                          //94
    undefined,                          //95
    undefined,                          //96
    undefined,                          //97
    undefined,                          //98
    undefined,                          //99
        this.LOAD_CONST,                    //100
    undefined,                          //101
    undefined,                          //102
    undefined,                          //103
    undefined,                          //104
    undefined,                          //105
    undefined,                          //106
    undefined,                          //107
    undefined,                          //108
    undefined,                          //109
    undefined,                          //110
    undefined,                          //111
    undefined,                          //112
    undefined,                          //113
    undefined,                          //114
    undefined,                          //115
    undefined,                          //116
    undefined,                          //117
    undefined,                          //118
    undefined,                          //119
    undefined,                          //120
    undefined,                          //121
    undefined,                          //122
    undefined,                          //123
    undefined,                          //124
    undefined,                          //125
    undefined,                          //126
    undefined,                          //127
    undefined,                          //128
    undefined,                          //129
    undefined,                          //130
    undefined,                          //131
        this.MAKE_FUNCTION,                 //132
    undefined,                          //133
    undefined,                          //134
    undefined,                          //135
    undefined,                          //136
    undefined,                          //137
    undefined,                          //138
    undefined,                          //139
    undefined,                          //140
    undefined,                          //141
    undefined,                          //142
    undefined,                          //143
    undefined,                          //144
    undefined,                          //145
    undefined,                          //146
    undefined,                          //147
    undefined,                          //148
    undefined,                          //149
    undefined,                          //150
    undefined,                          //151
    undefined,                          //152
    undefined,                          //153
    undefined,                          //154
    undefined,                          //155
    undefined,                          //156
    undefined,                          //157
    undefined,                          //158
    undefined,                          //159
    undefined,                          //160
    undefined,                          //161
    undefined,                          //162
    undefined,                          //163
    undefined,                          //164
    undefined,                          //165
    undefined,                          //166
    undefined,                          //167
    undefined,                          //168
    undefined,                          //169
    undefined,                          //170
    undefined,                          //171
    undefined,                          //172
    undefined,                          //173
    undefined,                          //174
    undefined,                          //175
    undefined,                          //176
    undefined,                          //177
    undefined,                          //178
    undefined,                          //179
    undefined,                          //180
    undefined,                          //181
    undefined,                          //182
    undefined,                          //183
    undefined,                          //184
    undefined,                          //185
    undefined,                          //186
    undefined,                          //187
    undefined,                          //188
    undefined,                          //189
    undefined,                          //190
    undefined,                          //191
    undefined,                          //192
    undefined,                          //193
    undefined,                          //194
    undefined,                          //195
    undefined,                          //196
    undefined,                          //197
    undefined,                          //198
    undefined,                          //199
    undefined,                          //200
    undefined,                          //201
    undefined,                          //202
    undefined,                          //203
    undefined,                          //204
    undefined,                          //205
    undefined,                          //206
    undefined,                          //207
    undefined,                          //208
    undefined,                          //209
    undefined,                          //210
    undefined,                          //211
    undefined,                          //212
    undefined,                          //213
    undefined,                          //214
    undefined,                          //215
    undefined,                          //216
    undefined,                          //217
    undefined,                          //218
    undefined,                          //219
    undefined,                          //220
    undefined,                          //221
    undefined,                          //222
    undefined,                          //223
    undefined,                          //224
    undefined,                          //225
    undefined,                          //226
    undefined,                          //227
    undefined,                          //228
    undefined,                          //229
    undefined,                          //230
    undefined,                          //231
    undefined,                          //232
    undefined,                          //233
    undefined,                          //234
    undefined,                          //235
    undefined,                          //236
    undefined,                          //237
    undefined,                          //238
    undefined,                          //239
    undefined,                          //240
    undefined,                          //241
    undefined,                          //242
    undefined,                          //243
    undefined,                          //244
    undefined,                          //245
    undefined,                          //246
    undefined,                          //247
    undefined,                          //248
    undefined,                          //249
    undefined,                          //250
    undefined,                          //251
    undefined,                          //252
    undefined,                          //253
    undefined                           //254
}