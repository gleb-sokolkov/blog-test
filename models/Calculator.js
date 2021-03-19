var keystone = require('keystone');
var Types = keystone.Field.Types;

var Calculator = new keystone.List('Calculator', {
    map: { name: "name" },
    autokey: { from: "name", path: "key", unique: true },
});

Calculator.add({
    name: { type: Types.Text, required: true, },
    virtualName: { type: Types.Text, default: "Конфигуратор виртуальных услуг", noedit: true, note: "Название блока виртуальной конфигурации", },
    cores: { type: Types.Number, label: "Ядра", note: "Цена с НДС(руб.)", },
    coresMin: { type: Types.Number, label: "Мин. Ядер", note: "шт." },
    coresMax: { type: Types.Number, label: "Макс. Ядер", note: "шт." },
    ram1: { type: Types.Number, label: "ОЗУ до 30ГБ", note: "Цена с НДС(руб.)", },
    ram2: { type: Types.Number, label: "ОЗУ от 31ГБ", note: "Цена с НДС(руб.)", },
    ramMin: { type: Types.Number, label: "Мин. ОЗУ", note: "ГБ" },
    ramMax: { type: Types.Number, label: "Макс. ОЗУ", note: "ГБ" },
    shd1: { type: Types.Number, label: "СХД до 20ГБ", note: "Цена с НДС(руб.)", },
    shd2: { type: Types.Number, label: "СХД от 21 до 100ГБ", note: "Цена с НДС(руб.)", },
    shd3: { type: Types.Number, label: "СХД от 101 до 1ТБ", note: "Цена с НДС(руб.)", },
    sataMin: { type: Types.Number, label: "Мин. SATA", note: "ГБ" },
    sataMax: { type: Types.Number, label: "Макс. SATA", note: "ГБ" },
    sasMin: { type: Types.Number, label: "Мин. SAS", note: "ГБ" },
    sasMax: { type: Types.Number, label: "Макс. SAS", note: "ГБ" },
    ssdMin: { type: Types.Number, label: "Мин. SSD", note: "ГБ" },
    ssdMax: { type: Types.Number, label: "Макс. SSD", note: "ГБ" },
    physicalName: { type: Types.Text, default: "Конфигуратор физических услуг", noedit: true, note: "Название блока физической конфигурации", },
    stand: { type: Types.Number, label: "Аренда стоек", note: "Цена с НДС(руб.)", note: "Цена с НДС(руб.) за одну 100% стойку", },
    standCharge1: { type: Types.Number, label: "ЭС стоек до 3 КВт", note: "Цена с НДС(руб.) за 1 стойку", },
    standCharge2: { type: Types.Number, label: "ЭС стоек 3-5 КВт", note: "Цена с НДС(руб.) за 1 стойку", },
    standCharge3: { type: Types.Number, label: "ЭС стоек 5-7 КВт", note: "Цена с НДС(руб.) за 1 стойку", },
    unit: { type: Types.Number, label: "Аренда Юнита", note: "Цена с НДС(руб.)", note: "Цена с НДС(руб.) за 1 юнит", },
    unitCharge1: { type: Types.Number, label: "ЭС сервера до 750 Вт", note: "Цена с НДС(руб.) за 1 юнит", },
    unitCharge2: { type: Types.Number, label: "ЭС сервера до 750-1400 Вт", note: "Цена с НДС(руб.) за 1 юнит", },
    unitCharge3: { type: Types.Number, label: "ЭС сервера до 1400-2500 Вт", note: "Цена с НДС(руб.) за 1 юнит", },
    internet1: { type: Types.Number, label: "Интернет 100 Мb", note: "Цена с НДС(руб.) за 1 юнит", },
    internet2: { type: Types.Number, label: "Интернет 1 GB", note: "Цена с НДС(руб.) за 1 юнит", },
    internet3: { type: Types.Number, label: "Интернет 10 GB", note: "Цена с НДС(руб.) за 1 юнит", },
});

Calculator.defaultColumns = "name virtualName physicalName";
Calculator.register();