'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

// Данни от твоя сметкоплан
const accountsData = [
  // РАЗДЕЛ 1: Капитали и заеми
  { code: '101', name: 'Основен капитал, изискващ регистрация', section: '1', group: '10', type: 'Пасивна', nature: 'Аналитична' },
  { code: '102', name: 'Капитал, неизискващ регистрация (консорциуми и дружества по ЗЗД)', section: '1', group: '10', type: 'Пасивна', nature: 'Аналитична' },
  { code: '103', name: 'Ликвидационен капитал при несъстоятелност и ликвидация', section: '1', group: '10', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '104', name: 'Капитал на предприятия с нестопанска дейност', section: '1', group: '10', type: 'Пасивна', nature: 'Аналитична' },
  
  { code: '111', name: 'Законови резерви', section: '1', group: '11', type: 'Пасивна', nature: 'Аналитична' },
  { code: '112', name: 'Резерви от последваща оценка на дълготрайни активи', section: '1', group: '11', type: 'Пасивна', nature: 'Аналитична' },
  { code: '113', name: 'Резерви от последваща оценка на финансови инструменти', section: '1', group: '11', type: 'Пасивна', nature: 'Аналитична' },
  { code: '114', name: 'Резерви от емисия на акции', section: '1', group: '11', type: 'Пасивна', nature: 'Аналитична' },
  { code: '115', name: 'Резерви, свързани с капитал', section: '1', group: '11', type: 'Пасивна', nature: 'Синтетична' },
  { code: '116', name: 'Обратно изкупени собствени акции', section: '1', group: '11', type: 'Активна', nature: 'Синтетична' },
  { code: '117', name: 'Резерви, формирани от печалбата', section: '1', group: '11', type: 'Пасивна', nature: 'Аналитична' },
  { code: '119', name: 'Други резерви', section: '1', group: '11', type: 'Пасивна', nature: 'Аналитична' },
  
  { code: '121', name: 'Непокрита загуба от минали години', section: '1', group: '12', type: 'Активна', nature: 'Аналитична' },
  { code: '122', name: 'Неразпределена печалба от минали години', section: '1', group: '12', type: 'Пасивна', nature: 'Аналитична' },
  { code: '123', name: 'Печалби и загуби от текущата година', section: '1', group: '12', type: 'Активно-пасивна', nature: 'Синтетична' },
  { code: '124', name: 'Резултат при несъстоятелност и ликвидация', section: '1', group: '12', type: 'Пасивна', nature: 'Синтетична' },
  { code: '125', name: 'Резултат от дейността на предприятия с нестопанска цел', section: '1', group: '12', type: 'Активно-пасивна', nature: 'Синтетична' },
  
  { code: '151', name: 'Получени краткосрочни заеми', section: '1', group: '15', type: 'Пасивна', nature: 'Аналитична' },
  { code: '152', name: 'Получени дългосрочни заеми', section: '1', group: '15', type: 'Пасивна', nature: 'Аналитична' },
  { code: '153', name: 'Кредитни карти', section: '1', group: '15', type: 'Пасивна', nature: 'Аналитична' },
  { code: '154', name: 'Дългови инструменти', section: '1', group: '15', type: 'Пасивна', nature: 'Аналитична' },
  { code: '156', name: 'Овърдрафт', section: '1', group: '15', type: 'Пасивна', nature: 'Аналитична' },
  { code: '159', name: 'Други заеми и дългове', section: '1', group: '15', type: 'Пасивна', nature: 'Аналитична' },

  // РАЗДЕЛ 2: Дълготрайни активи
  { code: '2011', name: 'Земи (Терени)', section: '2', group: '20', type: 'Активна', nature: 'Аналитична' },
  { code: '2012', name: 'Подобрения върху земите', section: '2', group: '20', type: 'Активна', nature: 'Аналитична' },
  { code: '202', name: 'Сгради и конструкции', section: '2', group: '20', type: 'Активна', nature: 'Аналитична' },
  { code: '203', name: 'Компютърна техника', section: '2', group: '20', type: 'Активна', nature: 'Аналитична' },
  { code: '204', name: 'Съоръжения', section: '2', group: '20', type: 'Активна', nature: 'Аналитична' },
  { code: '205', name: 'Машини и оборудване', section: '2', group: '20', type: 'Активна', nature: 'Аналитична' },
  { code: '206', name: 'Транспортни средства', section: '2', group: '20', type: 'Активна', nature: 'Аналитична' },
  { code: '207', name: 'Офис обзавеждане', section: '2', group: '20', type: 'Активна', nature: 'Аналитична' },
  { code: '209', name: 'Други дълготрайни материални активи', section: '2', group: '20', type: 'Активна', nature: 'Аналитична' },
  
  { code: '211', name: 'Продукти от развойна дейност', section: '2', group: '21', type: 'Активна', nature: 'Аналитична' },
  { code: '212', name: 'Програмни продукти', section: '2', group: '21', type: 'Активна', nature: 'Аналитична' },
  { code: '213', name: 'Права върху интелектуална собственост', section: '2', group: '21', type: 'Активна', nature: 'Аналитична' },
  { code: '214', name: 'Права върху индустриална собственост', section: '2', group: '21', type: 'Активна', nature: 'Аналитична' },
  { code: '219', name: 'Други дълготрайни нематериални активи', section: '2', group: '21', type: 'Активна', nature: 'Аналитична' },

  { code: '221', name: 'Инвестиции в дъщерни предприятия', section: '2', group: '22', type: 'Активна', nature: 'Аналитична' },
  { code: '222', name: 'Инвестиции в асоциирани предприятия', section: '2', group: '22', type: 'Активна', nature: 'Аналитична' },
  { code: '223', name: 'Инвестиции в смесени предприятия', section: '2', group: '22', type: 'Активна', nature: 'Аналитична' },
  { code: '224', name: 'Инвестиции в имоти (Инвестиционни имоти)', section: '2', group: '22', type: 'Активна', nature: 'Аналитична' },
  { code: '225', name: 'Инвестиции във финансови активи, държани до настъпване на падеж', section: '2', group: '22', type: 'Активна', nature: 'Аналитична' },
  { code: '226', name: 'Инвестиции във финансови активи, отчитани по справедлива стойност', section: '2', group: '22', type: 'Активна', nature: 'Аналитична' },
  { code: '227', name: 'Предоставени дългосрочни заеми и вземания', section: '2', group: '22', type: 'Активна', nature: 'Аналитична' },
  { code: '228', name: 'Инвестиции във финансови активи на разположение за продажба', section: '2', group: '22', type: 'Активна', nature: 'Аналитична' },
  { code: '229', name: 'Инвестиции в други дългосрочни финансови активи', section: '2', group: '22', type: 'Активна', nature: 'Аналитична' },

  { code: '231', name: 'Положителна търговска репутация', section: '2', group: '23', type: 'Активна', nature: 'Аналитична' },
  { code: '232', name: 'Отрицателна търговска репутация', section: '2', group: '23', type: 'Активна', nature: 'Аналитична' },

  { code: '2412', name: '(Натрупана) Амортизация на сгради и конструкции', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2413', name: '(Натрупана) Амортизация на компютърна техника', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2414', name: '(Натрупана) Амортизация на съоръжения', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2415', name: '(Натрупана) Амортизация на машини и оборудване', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2416', name: '(Натрупана) Амортизация на транспортни средства', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2417', name: '(Натрупана) Амортизация на офис обзавеждане', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2419', name: '(Натрупана) Амортизация на други дълготрайни материални активи', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2421', name: '(Натрупана) Амортизация на продукти от развойна дейност', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2422', name: '(Натрупана) Амортизация на програмни продукти', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2429', name: '(Натрупана) Амортизация на други дълготрайни нематериални активи', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2431', name: '(Натрупана) Амортизация на инвестиции в имоти', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2432', name: '(Натрупана) Амортизация на биологични активи', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },
  { code: '2433', name: '(Натрупана) Амортизация на положителна репутация', section: '2', group: '24', type: 'Корекционна', nature: 'Аналитична' },

  { code: '251', name: 'Корекция при обезценка на вземания', section: '2', group: '25', type: 'Корекционна', nature: 'Аналитична' },
  { code: '252', name: 'Корекция при обезценка на други активи', section: '2', group: '25', type: 'Корекционна', nature: 'Аналитична' },

  { code: '271', name: 'Гори', section: '2', group: '27', type: 'Активна', nature: 'Аналитична' },
  { code: '272', name: 'Трайни насаждения – плододаващи', section: '2', group: '27', type: 'Активна', nature: 'Аналитична' },
  { code: '273', name: 'Трайни насаждения – неплододаващи', section: '2', group: '27', type: 'Активна', nature: 'Аналитична' },
  { code: '274', name: 'Животни в основни стада', section: '2', group: '27', type: 'Активна', nature: 'Аналитична' },
  { code: '279', name: 'Други дълготрайни биологични активи', section: '2', group: '27', type: 'Активна', nature: 'Аналитична' },

  { code: '281', name: 'Земи (терени) с право на ползване', section: '2', group: '28', type: 'Активна', nature: 'Аналитична' },
  { code: '282', name: 'Сгради и конструкции с право на ползване', section: '2', group: '28', type: 'Активна', nature: 'Аналитична' },
  { code: '283', name: 'Транспортни средства с право на ползване', section: '2', group: '28', type: 'Активна', nature: 'Аналитична' },
  { code: '284', name: 'Машини, съоръжения и оборудване с право на ползване', section: '2', group: '28', type: 'Активна', nature: 'Аналитична' },
  { code: '285', name: 'Други дълготрайни материални активи с право на ползване', section: '2', group: '28', type: 'Активна', nature: 'Аналитична' },
  { code: '286', name: 'Програмни продукти с право на ползване', section: '2', group: '28', type: 'Активна', nature: 'Аналитична' },
  { code: '287', name: 'Други дълготрайни нематериални активи с право на ползване', section: '2', group: '28', type: 'Активна', nature: 'Аналитична' },

  { code: '291', name: '(Натрупана) Амортизация на земи (терени) с право на ползване', section: '2', group: '29', type: 'Корекционна', nature: 'Аналитична' },
  { code: '292', name: '(Натрупана) Амортизация на сгради и конструкции с право на ползване', section: '2', group: '29', type: 'Корекционна', nature: 'Аналитична' },
  { code: '293', name: '(Натрупана) Амортизация на транспортни средства с право на ползване', section: '2', group: '29', type: 'Корекционна', nature: 'Аналитична' },
  { code: '294', name: '(Натрупана) Амортизация на машини, съоръжения и оборудване с право на ползване', section: '2', group: '29', type: 'Корекционна', nature: 'Аналитична' },
  { code: '295', name: '(Натрупана) Амортизация на други дълготрайни материални активи с право на ползване', section: '2', group: '29', type: 'Корекционна', nature: 'Аналитична' },
  { code: '296', name: '(Натрупана) Амортизация на програмни продукти с право на ползване', section: '2', group: '29', type: 'Корекционна', nature: 'Аналитична' },
  { code: '297', name: '(Натрупана) Амортизация на други дълготрайни нематериални активи с право на ползване', section: '2', group: '29', type: 'Корекционна', nature: 'Аналитична' },

  // РАЗДЕЛ 3: Запаси
  { code: '301', name: 'Доставки', section: '3', group: '30', type: 'Активна', nature: 'Аналитична' },
  { code: '302', name: 'Суровини/Материали', section: '3', group: '30', type: 'Активна', nature: 'Аналитична' },
  { code: '303', name: 'Продукти', section: '3', group: '30', type: 'Активна', nature: 'Аналитична' },
  { code: '304', name: 'Стоки', section: '3', group: '30', type: 'Активна', nature: 'Аналитична' },

  { code: '311', name: 'Дребни продуктивни животни', section: '3', group: '31', type: 'Активна', nature: 'Аналитична' },
  { code: '312', name: 'Птици – основни стада', section: '3', group: '31', type: 'Активна', nature: 'Аналитична' },
  { code: '313', name: 'Пчелни семейства', section: '3', group: '31', type: 'Активна', nature: 'Аналитична' },
  { code: '314', name: 'Млади животни', section: '3', group: '31', type: 'Активна', nature: 'Аналитична' },
  { code: '315', name: 'Животни за угояване', section: '3', group: '31', type: 'Активна', nature: 'Аналитична' },
  { code: '316', name: 'Животни за експериментални цели', section: '3', group: '31', type: 'Активна', nature: 'Аналитична' },
  { code: '319', name: 'Други краткотрайни биологични активи', section: '3', group: '31', type: 'Активна', nature: 'Аналитична' },

  // РАЗДЕЛ 4: Разчети
  { code: '401', name: 'Задължения към доставчици', section: '4', group: '40', type: 'Пасивна', nature: 'Аналитична' },
  { code: '402', name: 'Вземания от доставчици по аванси', section: '4', group: '40', type: 'Активна', nature: 'Аналитична' },
  { code: '403', name: 'Задължения към доставчици по търговски кредити', section: '4', group: '40', type: 'Пасивна', nature: 'Аналитична' },
  { code: '404', name: 'Задължения към доставчици по доставки при определени условия', section: '4', group: '40', type: 'Пасивна', nature: 'Аналитична' },
  { code: '405', name: 'Задължения към доставчици – свързани лица', section: '4', group: '40', type: 'Пасивна', nature: 'Аналитична' },
  { code: '408', name: 'Нефактурирани аванси към доставчици', section: '4', group: '40', type: 'Активна', nature: 'Аналитична' },
  { code: '409', name: 'Други задължения към доставчици', section: '4', group: '40', type: 'Пасивна', nature: 'Аналитична' },

  { code: '411', name: 'Вземания от клиенти', section: '4', group: '41', type: 'Активна', nature: 'Аналитична' },
  { code: '412', name: 'Задължения към клиенти по аванси', section: '4', group: '41', type: 'Пасивна', nature: 'Аналитична' },
  { code: '413', name: 'Вземания от клиенти по търговски кредити', section: '4', group: '41', type: 'Активна', nature: 'Аналитична' },
  { code: '414', name: 'Вземания от клиенти по продажби при определени условия', section: '4', group: '41', type: 'Активна', nature: 'Аналитична' },
  { code: '415', name: 'Вземания от клиенти – свързани лица', section: '4', group: '41', type: 'Активна', nature: 'Аналитична' },
  { code: '418', name: 'Нефактурирани аванси от клиенти', section: '4', group: '41', type: 'Пасивна', nature: 'Аналитична' },
  { code: '419', name: 'Други вземания от клиенти', section: '4', group: '41', type: 'Активна', nature: 'Аналитична' },

  { code: '421', name: 'Задължения към персонал', section: '4', group: '42', type: 'Пасивна', nature: 'Аналитична' },
  { code: '422', name: 'Разчети с подотчетни лица', section: '4', group: '42', type: 'Активна', nature: 'Аналитична' },
  { code: '423', name: 'Задължения по неизползвани отпуски', section: '4', group: '42', type: 'Пасивна', nature: 'Аналитична' },
  { code: '424', name: 'Вземания от съучастия', section: '4', group: '42', type: 'Активна', nature: 'Аналитична' },
  { code: '425', name: 'Задължения за съучастия', section: '4', group: '42', type: 'Пасивна', nature: 'Аналитична' },
  { code: '426', name: 'Вземания по записани дялови вноски', section: '4', group: '42', type: 'Активна', nature: 'Аналитична' },
  { code: '427', name: 'Задължения към съдружници във връзка с намаляване на капитал', section: '4', group: '42', type: 'Пасивна', nature: 'Аналитична' },
  { code: '429', name: 'Други разчети с персонала и съдружниците', section: '4', group: '42', type: 'Активна', nature: 'Аналитична' },

  { code: '441', name: 'Вземания по рекламации', section: '4', group: '44', type: 'Активна', nature: 'Аналитична' },
  { code: '442', name: 'Вземания по липси и начети', section: '4', group: '44', type: 'Активна', nature: 'Аналитична' },
  { code: '443', name: 'Ценови разлики по липси и начети', section: '4', group: '44', type: 'Пасивна', nature: 'Аналитична' },
  { code: '444', name: 'Вземания по съдебни спорове', section: '4', group: '44', type: 'Активна', nature: 'Аналитична' },
  { code: '445', name: 'Присъдени вземания', section: '4', group: '44', type: 'Активна', nature: 'Аналитична' },

  { code: '4521', name: 'Разчети за Годишен корпоративен данък', section: '4', group: '45', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '4522', name: 'Разчети за Авансов корпоративен данък', section: '4', group: '45', type: 'Активно-пасивна', nature: 'Синтетична' },
  { code: '4531', name: 'Начислен данък върху добавената стойност за покупките', section: '4', group: '45', type: 'Активна', nature: 'Синтетична' },
  { code: '4532', name: 'Начислен данък върху добавената стойност за продажбите', section: '4', group: '45', type: 'Пасивна', nature: 'Синтетична' },
  { code: '4536', name: 'Отложен данъчен кредит', section: '4', group: '45', type: 'Активна', nature: 'Аналитична' },
  { code: '4537', name: 'Неизползван данъчен кредит', section: '4', group: '45', type: 'Активна', nature: 'Аналитична' },
  { code: '4538', name: 'Данък върху добавената стойност за възстановяване', section: '4', group: '45', type: 'Активна', nature: 'Синтетична' },
  { code: '4539', name: 'Данък върху добавената стойност за внасяне', section: '4', group: '45', type: 'Пасивна', nature: 'Синтетична' },
  { code: '454', name: 'Разчети за данъци върху доходи на физически лица', section: '4', group: '45', type: 'Активно-пасивна', nature: 'Синтетична' },
  { code: '456', name: 'Разчети за акцизи', section: '4', group: '45', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '457', name: 'Разчети с митници', section: '4', group: '45', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '459', name: 'Данъчни разчети с бюджета', section: '4', group: '45', type: 'Активно-пасивна', nature: 'Аналитична' },

  { code: '461', name: 'Разчети за задължително социално осигуряване', section: '4', group: '46', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '462', name: 'Разчети за доброволно социално и здравно осигуряване', section: '4', group: '46', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '463', name: 'Разчети за здравно осигуряване', section: '4', group: '46', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '469', name: 'Други разчети с осигурители', section: '4', group: '46', type: 'Активно-пасивна', nature: 'Аналитична' },

  { code: '491', name: 'Разчети с доверители', section: '4', group: '49', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '492', name: 'Разчети за гаранции', section: '4', group: '49', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '493', name: 'Разчети със собственици', section: '4', group: '49', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '494', name: 'Разчети по отсрочени данъци', section: '4', group: '49', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '495', name: 'Разчети по застраховане', section: '4', group: '49', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '496', name: 'Разчети по лихви', section: '4', group: '49', type: 'Активно-пасивна', nature: 'Аналитична' },
  { code: '497', name: 'Провизии', section: '4', group: '49', type: 'Пасивна', nature: 'Аналитична' },
  { code: '498', name: 'Други дебитори', section: '4', group: '49', type: 'Активна', nature: 'Аналитична' },
  { code: '499', name: 'Други кредитори', section: '4', group: '49', type: 'Пасивна', nature: 'Аналитична' },

  // РАЗДЕЛ 5: Финансови средства
  { code: '501', name: 'Каса', section: '5', group: '50', type: 'Активна', nature: 'Аналитична' },
  { code: '502', name: 'Каса във валута', section: '5', group: '50', type: 'Активна', nature: 'Аналитична' },
  { code: '503', name: 'Разплащателна', section: '5', group: '50', type: 'Активна', nature: 'Аналитична' },
  { code: '504', name: 'Разплащателна сметка във валута', section: '5', group: '50', type: 'Активна', nature: 'Аналитична' },
  { code: '505', name: 'Акредитиви', section: '5', group: '50', type: 'Активна', nature: 'Аналитична' },
  { code: '506', name: 'Предоставени депозити', section: '5', group: '50', type: 'Активна', nature: 'Аналитична' },
  { code: '507', name: 'Парични средства, заложени като обезпечение', section: '5', group: '50', type: 'Активна', nature: 'Аналитична' },
  { code: '509', name: 'Други парични средства (в т.ч. ваучери и чекове)', section: '5', group: '50', type: 'Активна', nature: 'Аналитична' },

  { code: '511', name: 'Финансови активи, отчитани по справедлива стойност в печалбата или загубата', section: '5', group: '51', type: 'Активна', nature: 'Аналитична' },
  { code: '512', name: 'Финансови активи, държани до настъпване на падеж', section: '5', group: '51', type: 'Активна', nature: 'Аналитична' },
  { code: '513', name: 'Краткосрочни заеми и вземания', section: '5', group: '51', type: 'Активна', nature: 'Аналитична' },
  { code: '514', name: 'Финансови активи на разположение за продажба', section: '5', group: '51', type: 'Активна', nature: 'Аналитична' },
  { code: '519', name: 'Други краткосрочни финансови активи (в т.ч. благородни метали)', section: '5', group: '51', type: 'Активна', nature: 'Аналитична' },

  // РАЗДЕЛ 6: Разходи
  { code: '601', name: 'Разходи за материали', section: '6', group: '60', type: 'Активна', nature: 'Аналитична' },
  { code: '602', name: 'Разходи за външни услуги', section: '6', group: '60', type: 'Активна', nature: 'Аналитична' },
  { code: '603', name: 'Разходи за амортизация', section: '6', group: '60', type: 'Активна', nature: 'Аналитична' },
  { code: '604', name: 'Разходи за заплати (възнаграждения)', section: '6', group: '60', type: 'Активна', nature: 'Аналитична' },
  { code: '605', name: 'Разходи за осигуровки', section: '6', group: '60', type: 'Активна', nature: 'Аналитична' },
  { code: '606', name: 'Разходи за данъци, такси и други подобни плащания', section: '6', group: '60', type: 'Активна', nature: 'Аналитична' },
  { code: '607', name: 'Разходи за провизии', section: '6', group: '60', type: 'Активна', nature: 'Аналитична' },
  { code: '608', name: 'Разходи от последващи оценки на активи', section: '6', group: '60', type: 'Активна', nature: 'Аналитична' },
  { code: '609', name: 'Други разходи', section: '6', group: '60', type: 'Активна', nature: 'Аналитична' },

  { code: '611', name: 'Разходи за основна дейност', section: '6', group: '61', type: 'Активна', nature: 'Аналитична' },
  { code: '612', name: 'Разходи за спомагателна дейност', section: '6', group: '61', type: 'Активна', nature: 'Аналитична' },
  { code: '613', name: 'Разходи за придобиване на дълготрайни активи', section: '6', group: '61', type: 'Активна', nature: 'Аналитична' },
  { code: '614', name: 'Административни разходи', section: '6', group: '61', type: 'Активна', nature: 'Аналитична' },
  { code: '615', name: 'Разходи за продажби', section: '6', group: '61', type: 'Активна', nature: 'Аналитична' },

  { code: '621', name: 'Разходи за лихви', section: '6', group: '62', type: 'Активна', nature: 'Аналитична' },
  { code: '623', name: 'Разходи от операции с финансови активи и инструменти', section: '6', group: '62', type: 'Активна', nature: 'Аналитична' },
  { code: '624', name: 'Разходи от валутни операции', section: '6', group: '62', type: 'Активна', nature: 'Синтетична' },
  { code: '625', name: 'Разходи от последващи оценки на финансови активи и инструменти', section: '6', group: '62', type: 'Активна', nature: 'Аналитична' },
  { code: '629', name: 'Други финансови разходи', section: '6', group: '62', type: 'Активна', nature: 'Аналитична' },

  { code: '651', name: 'Нефинансови разходи за бъдещи периоди', section: '6', group: '65', type: 'Активна', nature: 'Аналитична' },
  { code: '652', name: 'Финансови разходи за бъдещи периоди', section: '6', group: '65', type: 'Активна', nature: 'Аналитична' },

  // РАЗДЕЛ 7: Приходи
  { code: '701', name: 'Приходи от продажби на продукти', section: '7', group: '70', type: 'Пасивна', nature: 'Аналитична' },
  { code: '702', name: 'Приходи от продажби на стоки', section: '7', group: '70', type: 'Пасивна', nature: 'Аналитична' },
  { code: '703', name: 'Приходи от продажби на услуги', section: '7', group: '70', type: 'Пасивна', nature: 'Аналитична' },
  { code: '704', name: 'Приходи от наеми', section: '7', group: '70', type: 'Пасивна', nature: 'Аналитична' },
  { code: '705', name: 'Приходи от продажби на дълготрайни активи', section: '7', group: '70', type: 'Пасивна', nature: 'Аналитична' },
  { code: '706', name: 'Приходи от продажба на суровини/материали', section: '7', group: '70', type: 'Пасивна', nature: 'Аналитична' },
  { code: '707', name: 'Приходи от последваща оценка на активи', section: '7', group: '70', type: 'Пасивна', nature: 'Аналитична' },
  { code: '708', name: 'Приходи от финансирания', section: '7', group: '70', type: 'Пасивна', nature: 'Аналитична' },
  { code: '709', name: 'Други приходи от дейността', section: '7', group: '70', type: 'Пасивна', nature: 'Аналитична' },

  { code: '711', name: 'Приходи от регламентирана дейност', section: '7', group: '71', type: 'Пасивна', nature: 'Аналитична' },
  { code: '712', name: 'Приходи от членски внос', section: '7', group: '71', type: 'Пасивна', nature: 'Аналитична' },
  { code: '713', name: 'Приходи от финансирания и дарения', section: '7', group: '71', type: 'Пасивна', nature: 'Аналитична' },
  { code: '714', name: 'Други приходи', section: '7', group: '71', type: 'Пасивна', nature: 'Аналитична' },

  { code: '721', name: 'Приходи от лихви', section: '7', group: '72', type: 'Пасивна', nature: 'Аналитична' },
  { code: '722', name: 'Приходи от съучастия', section: '7', group: '72', type: 'Пасивна', nature: 'Аналитична' },
  { code: '723', name: 'Приходи от операции с финансови активи и инструменти', section: '7', group: '72', type: 'Пасивна', nature: 'Аналитична' },
  { code: '724', name: 'Приходи от валутни операции', section: '7', group: '72', type: 'Пасивна', nature: 'Аналитична' },
  { code: '725', name: 'Приходи от последващи оценки на финансови активи и инструменти', section: '7', group: '72', type: 'Пасивна', nature: 'Аналитична' },
  { code: '729', name: 'Други финансови приходи', section: '7', group: '72', type: 'Пасивна', nature: 'Аналитична' },

  { code: '751', name: 'Нефинансови приходи за бъдещи периоди', section: '7', group: '75', type: 'Пасивна', nature: 'Аналитична' },
  { code: '752', name: 'Финансови приходи за бъдещи периоди', section: '7', group: '75', type: 'Пасивна', nature: 'Аналитична' },
  { code: '753', name: 'Финансиране за дълготрайни активи', section: '7', group: '75', type: 'Пасивна', nature: 'Аналитична' },
  { code: '754', name: 'Финансиране на текущата дейност', section: '7', group: '75', type: 'Пасивна', nature: 'Аналитична' },

  // РАЗДЕЛ 9: Условни активи и пасиви
  { code: '911', name: 'Наети чужди активи', section: '9', group: '91', type: 'Активна', nature: 'Аналитична' },
  { code: '912', name: 'Чужди материални активи, получени по консигнационен договор', section: '9', group: '91', type: 'Активна', nature: 'Аналитична' },
  { code: '913', name: 'Материални активи, приети на съхранение', section: '9', group: '91', type: 'Активна', nature: 'Аналитична' },
  { code: '914', name: 'Финансови активи, приети на съхранение', section: '9', group: '91', type: 'Активна', nature: 'Аналитична' },

  { code: '981', name: 'Чужди материални и нематериални активи, получени като обезпечение', section: '9', group: '98', type: 'Активна', nature: 'Аналитична' },
  { code: '982', name: 'Чужди финансови активи, получени като обезпечение', section: '9', group: '98', type: 'Активна', nature: 'Аналитична' },
  { code: '983', name: 'Менителници или записи на заповед, получени като обезпечение', section: '9', group: '98', type: 'Активна', nature: 'Аналитична' },
  { code: '984', name: 'Други условни активи', section: '9', group: '98', type: 'Активна', nature: 'Аналитична' },
  { code: '989', name: 'Кореспондираща сметка за условни активи', section: '9', group: '98', type: 'Активна', nature: 'Аналитична' },

  { code: '991', name: 'Собствени материални и нематериални активи, предоставени като обезпечение', section: '9', group: '99', type: 'Пасивна', nature: 'Аналитична' },
  { code: '992', name: 'Собствени финансови активи, предоставени като обезпечение', section: '9', group: '99', type: 'Пасивна', nature: 'Аналитична' },
  { code: '993', name: 'Менителници или записи на заповед, предоставени като обезпечение', section: '9', group: '99', type: 'Пасивна', nature: 'Аналитична' },
  { code: '994', name: 'Други условни пасиви', section: '9', group: '99', type: 'Пасивна', nature: 'Аналитична' },
  { code: '999', name: 'Кореспондираща сметка за условни пасиви', section: '9', group: '99', type: 'Пасивна', nature: 'Аналитична' },
];

const sections = [
  { id: '1', name: 'Капитали и заеми' },
  { id: '2', name: 'Дълготрайни активи' },
  { id: '3', name: 'Запаси' },
  { id: '4', name: 'Разчети' },
  { id: '5', name: 'Финансови средства' },
  { id: '6', name: 'Разходи' },
  { id: '7', name: 'Приходи' },
  { id: '9', name: 'Условни активи и пасиви' },
];

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const filteredAccounts = useMemo(() => {
    return accountsData.filter(account => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        account.name.toLowerCase().includes(searchLower) ||
        account.code.includes(searchTerm);
      
      const matchesSection = selectedSection === 'all' || account.section === selectedSection;
      const matchesType = selectedType === 'all' || 
        (selectedType === 'active' && account.type === 'Активна') ||
        (selectedType === 'passive' && account.type === 'Пасивна') ||
        (selectedType === 'mixed' && account.type === 'Активно-пасивна') ||
        (selectedType === 'correction' && account.type === 'Корекционна');

      return matchesSearch && matchesSection && matchesType;
    });
  }, [searchTerm, selectedSection, selectedType]);

  const groupedAccounts = useMemo(() => {
    const groups: { [key: string]: typeof accountsData } = {};
    filteredAccounts.forEach(account => {
      const key = `${account.section}-${account.group}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(account);
    });
    return groups;
  }, [filteredAccounts]);

  const getSectionName = (sectionId: string) => {
    return sections.find(s => s.id === sectionId)?.name || sectionId;
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'Активна': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'Пасивна': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Активно-пасивна': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Корекционна': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Навигация */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto border-b border-white/10">
        <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-yellow-200 bg-clip-text text-transparent">
          Accountify
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/" className="hover:text-amber-400 transition">Начало</Link>
          <Link href="/dashboard" className="hover:text-amber-400 transition">Табло</Link>
          <Link href="/accounts" className="text-amber-400 font-semibold">Сметкоплан</Link>
        </div>
      </nav>

      <div className="px-8 py-12 max-w-7xl mx-auto">
        {/* Заглавие */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Национален <span className="text-amber-400">Сметкоплан</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Търси по име на сметка или код. Групирано по раздели според НСС.
          </p>
        </div>

        {/* Филтри */}
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Търсене */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">Търсене по име или код</label>
              <input
                type="text"
                placeholder="Например: 'Доставчици' или '401'..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            {/* Раздел */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Раздел</label>
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-400 transition"
              >
                <option value="all">Всички раздели</option>
                {sections.map(section => (
                  <option key={section.id} value={section.id}>
                    {section.id}. {section.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Типове бутони */}
          <div className="flex flex-wrap gap-2 pt-2">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedType === 'all' 
                  ? 'bg-amber-500 text-slate-900' 
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Всички
            </button>
            <button
              onClick={() => setSelectedType('active')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedType === 'active' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Активни
            </button>
            <button
              onClick={() => setSelectedType('passive')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedType === 'passive' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Пасивни
            </button>
            <button
              onClick={() => setSelectedType('mixed')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedType === 'mixed' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Активно-пасивни
            </button>
            <button
              onClick={() => setSelectedType('correction')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedType === 'correction' 
                  ? 'bg-orange-500 text-white' 
                  : 'bg-slate-800/50 text-gray-400 hover:bg-slate-700'
              }`}
            >
              Корекционни
            </button>
          </div>

          <div className="text-sm text-gray-500 pt-2">
            Намерени: <span className="text-amber-400 font-bold">{filteredAccounts.length}</span> сметки
          </div>
        </div>

        {/* Списък със сметки */}
        <div className="space-y-8">
          {Object.keys(groupedAccounts).length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>Не са намерени сметки за "{searchTerm}"</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedSection('all'); setSelectedType('all');}}
                className="mt-4 text-amber-400 hover:text-amber-300 underline"
              >
                Изчисти филтрите
              </button>
            </div>
          ) : (
            Object.entries(groupedAccounts).map(([key, accounts]) => {
              const [sectionId, groupId] = key.split('-');
              return (
                <div key={key} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h2 className="text-xl font-bold mb-6 text-amber-400 flex items-center gap-2">
                    <span className="bg-amber-500/20 px-3 py-1 rounded-lg text-sm">
                      Раздел {sectionId}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span>Група {groupId}</span>
                    <span className="text-gray-500 text-sm font-normal ml-auto">
                      {getSectionName(sectionId)}
                    </span>
                  </h2>

                  <div className="grid gap-3">
                    {accounts.map((account) => (
                      <div 
                        key={account.code}
                        className="flex items-center gap-4 p-4 bg-slate-800/30 rounded-xl border border-white/5 hover:border-amber-400/30 hover:bg-slate-800/50 transition group"
                      >
                        {/* Код - второстепенен */}
                        <div className="font-mono text-lg text-gray-500 font-medium w-20 shrink-0">
                          {account.code}
                        </div>

                        {/* Име - водещо */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white group-hover:text-amber-400 transition">
                            {account.name}
                          </h3>
                        </div>

                        {/* Тагове */}
                        <div className="flex gap-2 shrink-0">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getTypeColor(account.type)}`}>
                            {account.type}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                            {account.nature}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Легенда */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span className="text-gray-400">Активна (А)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-gray-400">Пасивна (П)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span className="text-gray-400">Активно-пасивна (А/П)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span className="text-gray-400">Корекционна (К)</span>
          </div>
        </div>
      </div>
    </main>
  );
}