Feature: Get clients bookmark (and check for Specification #10
  Once user has chosen a set of clients to import, use the field resource id’s from the 
  previous request to make several GET requests for each one. Then 
  get back each fields from above and expand growers, farms, fields

  Scenario: Choose set of clients to import
    Given the client is authorized
    When the client requests the "clients" bookmark with view parameter each_bookmarks_fields
    Then each item has at least the following information:
    | ATTRIBUTE     | 
    | _id           | 
    | bookmarks     | 
    | name          | 
    And the "bookmarks" attribute of each item contains at least the following information:
    | ATTRIBUTE     | 
    | _id           | 
    | fields        | 
    When each resource document for with id "$.*.bookmarks.fields._id" contains at least the following information: 
    | --------- FIELDS LIST DOC --------- | 
    | $.version                           | 
    | $.managementSoftware                |
    | $.growers                           |
    | $.farms                             |
    | $.fields                            |
    | $.managementSoftware.manufacturer   |
    | $.managementSoftware.version        |
    | $.growers.*._id                     |
    | $.growers.*.name                    |
    | $.farms.*._id                       |
    | $.farms.*.name                      |
    | $.farms.*.parent                    |
    | $.fields.*._id                      |
    | $.fields.*.name                     |
    | $.fields.*.parent                   |
    | $.fields.*.boundary                 |
    | $.fields.*.boundary.type            |
    | $.fields.*.boundary.coordinates     |
