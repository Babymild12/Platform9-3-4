insert into public.stations (code, name_th, name_en, region) values
  ('BKK-A', 'กรุงเทพอภิวัฒน์', 'Krung Thep Aphiwat', 'ภาคกลาง'),
  ('CNX', 'เชียงใหม่', 'Chiang Mai', 'ภาคเหนือ'),
  ('AYA', 'อยุธยา', 'Ayutthaya', 'ภาคกลาง'),
  ('PHS', 'พิษณุโลก', 'Phitsanulok', 'ภาคเหนือ'),
  ('NMA', 'นครราชสีมา', 'Nakhon Ratchasima', 'ภาคตะวันออกเฉียงเหนือ')
on conflict (code) do nothing;

insert into public.trains (train_number, name, train_type) values
  ('9', 'ขบวน 9', 'ด่วนพิเศษ'),
  ('13', 'ขบวน 13', 'ด่วนพิเศษ'),
  ('109', 'ขบวน 109', 'รถเร็ว'),
  ('7', 'ขบวน 7', 'ด่วนพิเศษ')
on conflict (train_number) do nothing;

insert into public.routes (train_id, origin_station_id, destination_station_id, departure_time, arrival_time, arrival_day_offset)
select t.id, o.id, d.id, x.departure_time, x.arrival_time, x.day_offset
from (values
  ('9', 'BKK-A', 'CNX', time '18:40', time '07:15', 1),
  ('13', 'BKK-A', 'CNX', time '20:05', time '08:45', 1),
  ('109', 'BKK-A', 'AYA', time '06:10', time '07:28', 0),
  ('7', 'BKK-A', 'PHS', time '09:05', time '13:35', 0)
) as x(train_number, origin_code, destination_code, departure_time, arrival_time, day_offset)
join public.trains t on t.train_number = x.train_number
join public.stations o on o.code = x.origin_code
join public.stations d on d.code = x.destination_code
on conflict (train_id, origin_station_id, destination_station_id) do nothing;