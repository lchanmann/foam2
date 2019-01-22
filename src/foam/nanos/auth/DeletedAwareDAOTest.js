/**
 * @license
 * Copyright 2019 The FOAM Authors. All Rights Reserved.
 * http://www.apache.org/licenses/LICENSE-2.0
 */

foam.CLASS({
  package: 'foam.nanos.auth',
  name: 'DeletedAwareDAOTest',
  extends: 'foam.nanos.test.Test',

  javaImports: [
    'foam.core.X',
    'foam.core.FObject',
    'foam.dao.DAO',
  ],

  methods: [
    {
      name: 'runTest',
      javaCode: `
        DeletedAwareDAOTest_remove_DeletedAware(x);
        DeletedAwareDAOTest_remove_non_DeletedAware(x);
      `
    },
    {
      name: 'DeletedAwareDAOTest_remove_DeletedAware',
      args: [
        { of: 'X', name: 'x' }
      ],
      javaCode: `
        DAO delegate = new foam.dao.MDAO(DeletedAwareDummy.getOwnClassInfo());
        DAO dao = (DAO) new DeletedAwareDAO.Builder(x)
          .setDelegate(delegate)
          .build();

        FObject object = new DeletedAwareDummy.Builder(x)
          .setId(1)
          .setDeleted(false)
          .build();
        object = (FObject) dao.put(object);

        dao.remove(object);
        object = (FObject) dao.find(object.getProperty("id"));

        test(object != null, "DeletedAwareDAO does not remove DeletedAware object from DAO.");
        test(
          ((DeletedAware) object).getDeleted(),
          "DeletedAwareDAO set DeletedAware.deleted=true on remove."
        );
      `
    },
    {
      name: 'DeletedAwareDAOTest_remove_non_DeletedAware',
      args: [
        { of: 'foam.core.X', name: 'x' }
      ],
      javaCode: `
        DAO delegate = new foam.dao.MDAO(Group.getOwnClassInfo());
        DAO dao = (DAO) new DeletedAwareDAO.Builder(x)
          .setDelegate(delegate)
          .build();

        FObject object = new Group.Builder(x)
          .setId("test")
          .build();
        object = (FObject) dao.put(object);

        dao.remove(object);
        object = dao.find(object.getProperty("id"));

        test(object == null, "DeletedAwareDAO remove non DeletedAware object from DAO.");
      `
    }
  ]
});
