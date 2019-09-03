/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.cron',
  name: 'OrSchedule',

  implements: [
    'foam.nanos.cron.Schedule'
  ],

  javaImports: [
    'java.util.Date'
  ],

  properties: [
    {
      name: 'delegates',
      class: 'FObjectArray',
      of: 'foam.nanos.cron.Schedule'
    }
  ],

  methods: [
    {
      name: 'getNextScheduledTime',
      javaCode: `
        Date min = null;
        for ( Schedule sched : getDelegates() ) {
          Date next = sched.getNextScheduledTime();
          if ( min == null ) {
            min = sched.getNextScheduledTime();
          } else if ( next.getTime() < min.getTime() ) {
            min = next;
          }
        }
        return min;
      `
    }
  ]
});
