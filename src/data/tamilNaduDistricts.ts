
export interface PickupDropPoint {
  pickup: string[];
  drop: string[];
}

export const tamilNaduDistricts: Record<string, PickupDropPoint> = {
  'Ariyalur': {
    pickup: ['Ariyalur Bus Stand', 'Udayarpalayam', 'Sendurai'],
    drop: ['Ariyalur Town', 'Jayankondam', 'Andimadam']
  },
  'Chengalpattu': {
    pickup: ['Chengalpattu Station', 'Tambaram', 'Madurantakam'],
    drop: ['GST Road', 'Urapakkam', 'Vandalur']
  },
  'Chennai': {
    pickup: ['Koyambedu', 'Central Railway Station', 'Tambaram'],
    drop: ['T. Nagar', 'Velachery', 'Adyar']
  },
  'Coimbatore': {
    pickup: ['Gandhipuram', 'Peelamedu', 'Ukkadam'],
    drop: ['RS Puram', 'Saibaba Colony', 'Singanallur']
  },
  'Cuddalore': {
    pickup: ['Cuddalore Port', 'Chidambaram', 'Vridhachalam'],
    drop: ['Cuddalore Town', 'Panruti', 'Kattumannarkoil']
  },
  'Dharmapuri': {
    pickup: ['Dharmapuri Bus Stand', 'Harur', 'Palacode'],
    drop: ['Dharmapuri Town', 'Pennagaram', 'Karimangalam']
  },
  'Dindigul': {
    pickup: ['Dindigul Junction', 'Palani', 'Kodaikanal Road'],
    drop: ['Dindigul Town', 'Natham', 'Vedasandur']
  },
  'Erode': {
    pickup: ['Erode Junction', 'Bhavani', 'Gobichettipalayam'],
    drop: ['Erode Town', 'Sathyamangalam', 'Anthiyur']
  },
  'Kallakurichi': {
    pickup: ['Kallakurichi Bus Stand', 'Sankarapuram', 'Tirukoilur'],
    drop: ['Kallakurichi Town', 'Ulundurpet', 'Chinnaselam']
  },
  'Kancheepuram': {
    pickup: ['Kancheepuram Station', 'Sriperumbudur', 'Uthiramerur'],
    drop: ['Kancheepuram Town', 'Walajabad', 'Cheyyur']
  },
  'Kanyakumari': {
    pickup: ['Nagercoil Junction', 'Kanyakumari', 'Marthandam'],
    drop: ['Nagercoil Town', 'Thuckalay', 'Colachel']
  },
  'Karur': {
    pickup: ['Karur Bus Stand', 'Kulithalai', 'Krishnarayapuram'],
    drop: ['Karur Town', 'Aravakurichi', 'Manmangalam']
  },
  'Krishnagiri': {
    pickup: ['Krishnagiri Bus Stand', 'Hosur', 'Dharmapuri Road'],
    drop: ['Krishnagiri Town', 'Pochampalli', 'Uthangarai']
  },
  'Madurai': {
    pickup: ['Mattuthavani', 'Periyar Bus Stand', 'Thirunagar'],
    drop: ['Anna Nagar', 'Tallakulam', 'KK Nagar']
  },
  'Mayiladuthurai': {
    pickup: ['Mayiladuthurai Junction', 'Sirkazhi', 'Poompuhar'],
    drop: ['Mayiladuthurai Town', 'Kuthalam', 'Tharangambadi']
  },
  'Nagapattinam': {
    pickup: ['Nagapattinam Port', 'Vedaranyam', 'Thiruvarur Road'],
    drop: ['Nagapattinam Town', 'Karaikal', 'Kilvelur']
  },
  'Namakkal': {
    pickup: ['Namakkal Bus Stand', 'Rasipuram', 'Tiruchengode'],
    drop: ['Namakkal Town', 'Komarapalayam', 'Paramathi Velur']
  },
  'Nilgiris': {
    pickup: ['Ooty Bus Stand', 'Coonoor', 'Kotagiri'],
    drop: ['Ooty Town', 'Wellington', 'Gudalur']
  },
  'Perambalur': {
    pickup: ['Perambalur Bus Stand', 'Kunnam', 'Alathur'],
    drop: ['Perambalur Town', 'Veppanthattai', 'Valikandapuram']
  },
  'Pudukkottai': {
    pickup: ['Pudukkottai Bus Stand', 'Aranthangi', 'Kulathur'],
    drop: ['Pudukkottai Town', 'Thirumayam', 'Gandarvakottai']
  },
  'Ramanathapuram': {
    pickup: ['Ramanathapuram Bus Stand', 'Rameswaram', 'Mudukulathur'],
    drop: ['Ramanathapuram Town', 'Mandapam', 'Paramakudi']
  },
  'Ranipet': {
    pickup: ['Ranipet Bus Stand', 'Arcot', 'Walajah'],
    drop: ['Ranipet Town', 'Nemili', 'Thimiri']
  },
  'Salem': {
    pickup: ['New Bus Stand', 'Shevapet', 'Fairlands'],
    drop: ['Hastampatti', 'Suramangalam', 'Ammapet']
  },
  'Sivaganga': {
    pickup: ['Sivaganga Bus Stand', 'Karaikudi', 'Devakottai'],
    drop: ['Sivaganga Town', 'Tiruppattur', 'Manamadurai']
  },
  'Tenkasi': {
    pickup: ['Tenkasi Junction', 'Sankarankovil', 'Kadayanallur'],
    drop: ['Tenkasi Town', 'Alangulam', 'Veerakeralampudur']
  },
  'Thanjavur': {
    pickup: ['Thanjavur Junction', 'Kumbakonam', 'Thiruvidaimarudur'],
    drop: ['Thanjavur Town', 'Orathanadu', 'Papanasam']
  },
  'Theni': {
    pickup: ['Theni Bus Stand', 'Periyakulam', 'Uthamapalayam'],
    drop: ['Theni Town', 'Bodinayakanur', 'Andipatti']
  },
  'Thoothukudi': {
    pickup: ['Thoothukudi Port', 'Kovilpatti', 'Vilathikulam'],
    drop: ['Thoothukudi Town', 'Sathankulam', 'Ottapidaram']
  },
  'Tiruchirappalli': {
    pickup: ['Central Bus Stand', 'Srirangam', 'Thillai Nagar'],
    drop: ['Cantonment', 'Tennur', 'Woraiyur']
  },
  'Tirunelveli': {
    pickup: ['Tirunelveli Junction', 'Palayamkottai', 'Ambasamudram'],
    drop: ['Tirunelveli Town', 'Kallidaikurichi', 'Radhapuram']
  },
  'Tirupattur': {
    pickup: ['Tirupattur Bus Stand', 'Vaniyambadi', 'Ambur'],
    drop: ['Tirupattur Town', 'Natrampalli', 'Jolarpet']
  },
  'Tiruvallur': {
    pickup: ['Tiruvallur Bus Stand', 'Ponneri', 'Gummidipoondi'],
    drop: ['Tiruvallur Town', 'Poonamallee', 'Avadi']
  },
  'Tiruvannamalai': {
    pickup: ['Tiruvannamalai Bus Stand', 'Polur', 'Arani'],
    drop: ['Tiruvannamalai Town', 'Chengam', 'Vandavasi']
  },
  'Tiruvarur': {
    pickup: ['Tiruvarur Bus Stand', 'Mannargudi', 'Nannilam'],
    drop: ['Tiruvarur Town', 'Thiruthuraipoondi', 'Kodavasal']
  },
  'Vellore': {
    pickup: ['Vellore Bus Stand', 'Katpadi Junction', 'Gudiyatham'],
    drop: ['Vellore Town', 'Saidapet', 'Pernambut']
  },
  'Viluppuram': {
    pickup: ['Viluppuram Junction', 'Tindivanam', 'Gingee'],
    drop: ['Viluppuram Town', 'Mailam', 'Vikravandi']
  },
  'Virudhunagar': {
    pickup: ['Virudhunagar Junction', 'Sivakasi', 'Srivilliputhur'],
    drop: ['Virudhunagar Town', 'Rajapalayam', 'Watrap']
  }
};

export const getDistrictNames = (): string[] => {
  return Object.keys(tamilNaduDistricts).sort();
};

export const getPickupPoints = (district: string): string[] => {
  return tamilNaduDistricts[district]?.pickup || [];
};

export const getDropPoints = (district: string): string[] => {
  return tamilNaduDistricts[district]?.drop || [];
};
