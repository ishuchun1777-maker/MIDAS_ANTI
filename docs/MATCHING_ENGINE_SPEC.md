# MIDAS Matching Engine Specification

The MIDAS Matching Engine is responsible for recommending the most effective advertising opportunities for a business.

It analyzes:

- business profile
- target audience
- geography
- interests
- media inventory

and matches businesses with the most relevant advertising assets.

---

# Matching Goal

Provide the best possible advertising recommendations for buyers.

The system must answer:

Where should this business advertise?

---

# Inputs

The matching engine uses the following data:

## Business Data

Business industry  
Target audience age  
Target gender  
Target interests  
Target city  
Budget range  

Example:

Industry: Fitness  
Audience age: 18-35  
Location: Tashkent  

---

## Asset Data

Media type  
Audience demographics  
Location  
Engagement metrics  
Price  

Example:

Instagram influencer  
Audience: 70% female  
Age: 18-30  
Location: Tashkent  

---

# Matching Logic

The system calculates a relevance score.

Score range:

0 — 100

Higher score means better match.

---

# Matching Factors

## Industry Relevance

How relevant the audience is to the business category.

Example:

Fitness business + fitness influencer = high score.

---

## Audience Overlap

Compare:

Target audience  
Asset audience

Factors:

Age  
Gender  
Interests  

---

## Geographic Relevance

Location match.

Example:

Business in Samarkand

Billboard in Samarkand = high score.

Billboard in another city = lower score.

---

## Engagement Quality

For digital media:

Engagement rate  
View count  
Follower authenticity  

Higher engagement increases score.

---

## Budget Fit

Asset price must match the buyer budget.

Example:

Budget: $300

Asset price: $250 → good match

Asset price: $2000 → low match

---

# Score Calculation (Example)

Example formula:

Score =

Industry relevance * 0.30
+
Audience overlap * 0.30
+
Geographic relevance * 0.20
+
Engagement quality * 0.10
+
Budget fit * 0.10

Maximum score = 100

---

# Output

Matching engine returns ranked assets.

Example:

1. Instagram influencer A — score 92  
2. Telegram channel B — score 84  
3. LED billboard C — score 76  

---

# Recommendation Interface

Buyer dashboard shows:

Recommended advertising channels.

Example:

"Best matches for your business"

---

# AI Extension (Future)

Later versions can include:

Machine learning models.

Inputs:

Historical campaign performance  
Conversion metrics  

Output:

Predicted campaign success.

---

# MVP Matching

For MVP the system should use rule-based scoring.

No machine learning required.

---

# Future Matching Engine

Advanced system may include:

Audience graph  
Influencer network analysis  
AI recommendation engine  
ROI prediction model

---

# Matching Frequency

Matching should run:

When buyer creates profile  
When campaign is created  
When new assets are added