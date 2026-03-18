       IDENTIFICATION DIVISION.
       PROGRAM-ID. SAMPLE-PROGRAM.

       DATA DIVISION.
       WORKING-STORAGE SECTION.
       01  WS-CONDITION-A          PIC X(01) VALUE 'Y'.
       01  WS-CONDITION-B          PIC X(01) VALUE 'N'.
       01  WS-CONDITION-C          PIC X(01) VALUE 'Y'.
       01  WS-COUNTER              PIC 9(03) VALUE 000.
       01  WS-RESULT               PIC X(10).

       PROCEDURE DIVISION.

      * Example 1: Nested IF statements
           IF WS-CONDITION-A = 'Y'
               DISPLAY 'Condition A is TRUE'
               IF WS-CONDITION-B = 'Y'
                   DISPLAY 'Condition B is TRUE'
                   IF WS-CONDITION-C = 'Y'
                       DISPLAY 'Condition C is TRUE'
                   ELSE
                       DISPLAY 'Condition C is FALSE'
                   END-IF
               ELSE
                   DISPLAY 'Condition B is FALSE'
               END-IF
           ELSE
               DISPLAY 'Condition A is FALSE'
           END-IF

      * Example 2: PERFORM with nested IF
           PERFORM VARYING WS-COUNTER FROM 1 BY 1 UNTIL WS-COUNTER > 10
               IF WS-COUNTER < 5
                   DISPLAY 'Counter is less than 5'
               ELSE
                   DISPLAY 'Counter is 5 or more'
               END-IF
           END-PERFORM

      * Example 3: EVALUATE with nested IF
           EVALUATE TRUE
               WHEN WS-CONDITION-A = 'Y'
                   IF WS-CONDITION-B = 'Y'
                       DISPLAY 'Both A and B are Y'
                   ELSE
                       DISPLAY 'Only A is Y'
                   END-IF
               WHEN WS-CONDITION-B = 'Y'
                   DISPLAY 'B is Y'
               WHEN OTHER
                   DISPLAY 'Neither condition met'
           END-EVALUATE

           STOP RUN.
