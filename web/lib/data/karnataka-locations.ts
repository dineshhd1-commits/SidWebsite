/** Local, curated place list for the Event Location autocomplete - no
 * external API, so this is a static (not exhaustive) dataset rather than a
 * live geocoder. Karnataka gets by far the deepest coverage (every district
 * plus its major taluks/towns and popular Bengaluru/Davanagere localities)
 * since that's the primary service area; INDIA_OTHER_LOCATIONS adds major
 * cities from the rest of the country so the field isn't Karnataka-only.
 * Common alternate spellings (Bangalore/Bengaluru, Mysore/Mysuru, etc.) are
 * included so either one surfaces the right suggestion. */

export const KARNATAKA_LOCATIONS: string[] = [
  // Bagalkot district
  'Bagalkot', 'Badami', 'Bilagi', 'Guledgudda', 'Hunagund', 'Ilkal', 'Jamkhandi',
  'Mudhol', 'Rabkavi Banhatti', 'Terdal',

  // Ballari / Vijayanagara district
  'Ballari', 'Bellary', 'Hospet', 'Hosapete', 'Sandur', 'Siruguppa', 'Kudligi',
  'Kampli', 'Kottur', 'Harapanahalli',

  // Belagavi district
  'Belagavi', 'Belgaum', 'Athani', 'Bailhongal', 'Chikodi', 'Gokak', 'Hukkeri',
  'Khanapur', 'Kittur', 'Ramdurg', 'Raybag', 'Saundatti', 'Nippani', 'Kagwad',

  // Bengaluru Urban & Rural districts
  'Bengaluru', 'Bangalore', 'Anekal', 'Yelahanka', 'Bommanahalli', 'Devanahalli',
  'Doddaballapura', 'Hoskote', 'Nelamangala',

  // Bidar district
  'Bidar', 'Aurad', 'Basavakalyan', 'Bhalki', 'Humnabad',

  // Chamarajanagar district
  'Chamarajanagar', 'Gundlupet', 'Kollegal', 'Yelandur', 'Hanur',

  // Chikkaballapur district
  'Chikkaballapur', 'Bagepalli', 'Chintamani', 'Gauribidanur', 'Gudibande', 'Sidlaghatta',

  // Chikkamagaluru district
  'Chikkamagaluru', 'Chikmagalur', 'Kadur', 'Koppa', 'Mudigere',
  'Narasimharajapura', 'Sringeri', 'Tarikere',

  // Chitradurga district
  'Chitradurga', 'Challakere', 'Hiriyur', 'Holalkere', 'Hosadurga', 'Molakalmuru',

  // Dakshina Kannada district
  'Mangaluru', 'Mangalore', 'Bantwal', 'Belthangady', 'Moodabidri', 'Puttur',
  'Sulya', 'Ullal',

  // Davanagere district (home city of the business)
  'Davanagere', 'Channagiri', 'Harihar', 'Honnali', 'Jagalur', 'Vidyanagar',
  'PJ Extension', 'MCC Extension', 'Shamanur', 'Nittuvalli', 'Anjaneya Extension',
  'Basaveshwara Nagar', 'Hadadi Road', 'Jayadeva Circle',

  // Dharwad district
  'Dharwad', 'Hubballi', 'Hubli', 'Alnavar', 'Kalghatgi', 'Kundgol', 'Navalgund',

  // Gadag district
  'Gadag', 'Betageri', 'Mundargi', 'Nargund', 'Ron', 'Shirahatti',

  // Hassan district
  'Hassan', 'Alur', 'Arakalgud', 'Arsikere', 'Belur', 'Channarayapatna',
  'Holenarasipura', 'Sakleshpur',

  // Haveri district
  'Haveri', 'Byadgi', 'Hangal', 'Hirekerur', 'Ranebennur', 'Savanur', 'Shiggaon',

  // Kalaburagi district
  'Kalaburagi', 'Gulbarga', 'Afzalpur', 'Aland', 'Chincholi', 'Chittapur', 'Jevargi', 'Sedam',

  // Kodagu district
  'Madikeri', 'Somwarpet', 'Virajpet', 'Kushalnagar', 'Kodagu',

  // Kolar district
  'Kolar', 'Bangarapet', 'Malur', 'Mulbagal', 'Srinivaspur', 'Robertsonpet',

  // Koppal district
  'Koppal', 'Gangavati', 'Kushtagi', 'Yelburga',

  // Mandya district
  'Mandya', 'Krishnarajpet', 'Maddur', 'Malavalli', 'Nagamangala', 'Pandavapura',
  'Srirangapatna',

  // Mysuru district
  'Mysuru', 'Mysore', 'Hunsur', 'Krishnarajanagar', 'Nanjangud', 'Piriyapatna',
  'Tirumakudalu Narasipura', 'Heggadadevanakote',

  // Raichur district
  'Raichur', 'Devadurga', 'Lingasugur', 'Manvi', 'Sindhanur', 'Sirwar',

  // Ramanagara district
  'Ramanagara', 'Channapatna', 'Kanakapura', 'Magadi',

  // Shivamogga district
  'Shivamogga', 'Shimoga', 'Bhadravati', 'Hosanagara', 'Sagara', 'Shikaripura',
  'Sorab', 'Thirthahalli',

  // Tumakuru district
  'Tumakuru', 'Tumkur', 'Chikkanayakanahalli', 'Gubbi', 'Koratagere', 'Kunigal',
  'Madhugiri', 'Pavagada', 'Sira', 'Tiptur', 'Turuvekere',

  // Udupi district
  'Udupi', 'Karkala', 'Kundapura', 'Brahmavar',

  // Uttara Kannada district
  'Karwar', 'Ankola', 'Bhatkal', 'Dandeli', 'Haliyal', 'Honnavar', 'Joida',
  'Kumta', 'Mundgod', 'Sirsi', 'Siddapur', 'Yellapur',

  // Vijayapura district
  'Vijayapura', 'Bijapur', 'Basavana Bagevadi', 'Indi', 'Muddebihal', 'Sindagi',

  // Yadgir district
  'Yadgir', 'Shahapur', 'Shorapur', 'Surpur',

  // Popular Bengaluru localities / neighbourhoods
  'Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar', 'Malleshwaram',
  'Rajajinagar', 'Electronic City', 'Marathahalli', 'HSR Layout',
  'BTM Layout', 'Basavanagudi', 'Banashankari', 'Hebbal', 'RT Nagar',
  'Vijayanagar', 'JP Nagar', 'Sarjapur', 'Bellandur', 'Yeshwanthpur',
  'Kengeri', 'Peenya', 'Ulsoor', 'Frazer Town', 'Cox Town', 'Shivajinagar',
  'Domlur', 'HBR Layout', 'Kalyan Nagar', 'Vidyaranyapura', 'Nagarbhavi',
  'Rajarajeshwari Nagar', 'Hulimavu', 'Cunningham Road', 'MG Road',
  'Brigade Road', 'Richmond Town',
];

/** Major cities and towns from outside Karnataka, covering every state and
 * union territory at least once, so the field works for the occasional
 * out-of-state enquiry without being a full national gazetteer. */
export const INDIA_OTHER_LOCATIONS: string[] = [
  'Mumbai', 'Delhi', 'New Delhi', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata',
  'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore',
  'Thane', 'Bhopal', 'Visakhapatnam', 'Vadodara', 'Ghaziabad', 'Ludhiana',
  'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan', 'Vasai',
  'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai',
  'Prayagraj', 'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
  'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Guwahati',
  'Chandigarh', 'Thiruvananthapuram', 'Kochi', 'Cochin', 'Kozhikode', 'Calicut',
  'Bhubaneswar', 'Patna', 'Amravati', 'Noida', 'Gurugram', 'Gurgaon',
  'Dehradun', 'Shimla', 'Panaji', 'Goa', 'Puducherry', 'Pondicherry', 'Imphal',
  'Shillong', 'Agartala', 'Aizawl', 'Kohima', 'Itanagar', 'Gangtok', 'Dispur',
  'Tirupati', 'Warangal', 'Nellore', 'Guntur', 'Salem', 'Tiruchirappalli',
  'Trichy', 'Vellore', 'Erode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha',
  'Solapur', 'Kolhapur', 'Nanded', 'Jalgaon',
  'Udaipur', 'Ajmer', 'Bikaner', 'Bhilai', 'Bilaspur', 'Durgapur', 'Asansol',
  'Siliguri', 'Jamshedpur', 'Bokaro', 'Muzaffarpur', 'Gaya', 'Bhagalpur',
  'Rourkela', 'Cuttack', 'Puri', 'Jammu', 'Bhavnagar', 'Jamnagar',
  'Gandhinagar', 'Anand', 'Panipat', 'Karnal', 'Hisar', 'Rohtak', 'Bathinda',
  'Jalandhar', 'Patiala', 'Moradabad', 'Bareilly', 'Aligarh', 'Saharanpur',
  'Gorakhpur', 'Greater Noida',
];
