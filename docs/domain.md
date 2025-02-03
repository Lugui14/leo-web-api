# Domain Diagram

Users Domain
└── Club (Aggregate Root)
    ├── Person
    │   ├── Monthly Fee
    │   └── (has Roles)
    └── Role
        ├── Associated
        ├── Pre-leo
        ├── Technical
        └── ...other roles
Event Domain
└── Event
    ├── Ticket
    ├── Accommodation
    ├── EventLocalization
    ├── Drink/Food
    ├── Drink/FoodTicket
    ├── Infrastructure
    └── Sponsorship

Campaign Domain
└── Campaign
    ├── Participants
    ├── PartnerCompany
    └── CampaignLocalization

Financial Domain
└── ClubAccount
    ├── Extract
    └── Invoice