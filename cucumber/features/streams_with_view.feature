Feature: Get resources WITH various view parameters

  Scenario: Get the MOISTURE stream with filtering changeId 
    Get moisture stream with changeId > 0, AND get moisture with changeId > VERY_LARGE_NUMBER (max int) - 1
    Given the client is authorized
    When the client requests a "moisture" stream for harvester with identifier "4727" with view parameter stream_gt_0
    Then the response contains at least the following information:
    |    ATTRIBUTE       |  
    |       units        |  
    |       stream       |  
    |       stream_type  |  
    |       _meta        | 
    And the "_meta" attribute contains at least the following information:
    |    ATTRIBUTE       |  
    |     _changeId      | 
    And the "stream_type" attribute is "moisture"
    And the "stream" attribute contains 1 or more item
    And each item in "stream" has at least the following information:
    |     ATTRIBUTE      |
    |       _meta        |
    |       moisture     |
    |       t            |
    And the "_meta" attribute of each item in "stream" contains at least the following information:
    | ATTRIBUTE                | DESCRIPTION                         |
    |   _changeId              | What version are these data         |
    And check the "moisture" stream again, this time with view parameter stream_max
    And the "stream" attribute contains only 0 item


  Scenario: Get the LOCATION stream with filtering changeId
    Get location stream with changeId > 0, AND get location with changeId > VERY_LARGE_NUMBER - 1
    Given the client is authorized
    When the client requests a "location" stream for harvester with identifier "4727" with view parameter stream_gt_0
    And the response contains at least the following information:
    | ATTRIBUTE                | 
    |   coordinate_system      | 
    |   stream                 | 
    |   stream_type            | 
    |   _meta                  | 
    And the "_meta" attribute contains at least the following information:
    |    ATTRIBUTE       |  
    |     _changeId      | 
    And the "stream" attribute contains 1 or more item
    And each item in "stream" has at least the following information:
    | ATTRIBUTE            |
    |     _meta            |
    |     t                |
    |     lat              |
    |     lon              |
    |     alt              |
    And the "_meta" attribute of each item in "stream" contains at least the following information:
    | ATTRIBUTE                | DESCRIPTION                         |
    |   _changeId              | What revision are these data        |
    And check the "locations" stream again, this time with view parameter stream_max
    And the "stream" attribute contains only 0 item


  Scenario: Get the WORK STATUS stream with filtering changeId > 0, changeId > max -1
    Given the client is authorized
    When the client requests a "work_status" stream for harvester with identifier "4727" with view parameter stream_gt_0
    And the response contains at least the following information:
    |     ATTRIBUTE        | 
    |      stream          | 
    |      stream_type     | 
    |      _meta           |
    And the "stream" attribute contains 1 or more item
    And each item in "stream" has at least the following information:
    |      ATTRIBUTE     |
    |        _meta       |
    |        t           |
    |        case        |
    And the "_meta" attribute of each item in "stream" contains at least the following information:
    | ATTRIBUTE                | DESCRIPTION                         |
    |   _changeId              | What revision are these data        |
    And check the "work_status" stream again, this time with view parameter stream_max
    And the "stream" attribute contains only 0 item


  Scenario: Get the WET MASS FLOW stream with filtering changeId > 0, changeId > max -1
    Given the client is authorized
    When the client requests a "wet_mass_flow" stream for harvester with identifier "4727" with view parameter stream_gt_0
    Then the response contains at least the following information:
    |    ATTRIBUTE       |  
    |       units        |  
    |       stream       |  
    |       stream_type  |  
    |       _meta        | 
    And the "_meta" attribute contains at least the following information:
    |    ATTRIBUTE       |  
    |     _changeId      | 
    And the "stream_type" attribute is "wet mass flow"
    And the "stream" attribute contains 1 or more item
    And each item in "stream" has at least the following information:
    |     ATTRIBUTE      |
    |       _meta        |
    |       flow         |
    |       t            |
    And the "_meta" attribute of each item in "stream" contains at least the following information:
    | ATTRIBUTE                | DESCRIPTION                         |
    |   _changeId              | What version  are these data        |
    And check the "wet_mass_flow" stream again, this time with view parameter stream_max


  Scenario: Get geofence stream (1241) and verify that the data make sense
    Retrieves the geofence data with view and check for enter/exit pairs.

    Given the client is authorized
    When the client requests a "geofence" stream for harvester with identifier "4727" with view parameter t3_geofence
    And the "stream" attribute contains 1 or more item
    And each item in "stream" has at least the following information:
    | ATTRIBUTE  | DESCRIPTION                            |
    |      t     | timestamp of stream                    |
    |    field   | field information                      |
    |    event   | enter or exit                          |
    And the "field" attribute of each item in "stream" contains at least the following information:
    | ATTRIBUTE  | DESCRIPTION                            |
    |   _id      | ..                                     |
    |    name    | human-readable name of the field       |
    And the items in "$.stream" has enter-exit pair, if any exit.

    ## Additionally, also test swath_width