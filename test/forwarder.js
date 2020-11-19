const ForwarderFactory = artifacts.require("ForwarderFactory");
const Forwarder = artifacts.require("Forwarder");
const TestERC20Token = artifacts.require("TestERC20Token");

contract('Forwarder', (accounts) => {
  let instance;
  let randomAccount;
  const transferAmount = 1000;

  beforeEach(async () => {
    randomAccount = web3.eth.accounts.create();
    const factory = await ForwarderFactory.new();
    const createForwarderContractReceipt = await factory.create(randomAccount.address);
    const forwarderContractAddress = createForwarderContractReceipt.logs[0].args.forwarderAddress;
    instance = await Forwarder.at(forwarderContractAddress);
  });

  describe('receive ETH', () => {
    beforeEach(async () => {
      await web3.eth.sendTransaction({
        from: accounts[0],
        to: instance.address,
        value: transferAmount.toString(),
        gas: 2000000
      });
    });

    it('stores received ETH', async () => {
      const balance = await web3.eth.getBalance(instance.address);

      assert.equal(balance.valueOf(), transferAmount, transferAmount + " wasn't in the Contract");
    });

    describe('flush ETH', () => {
      beforeEach(async () => {
        await instance.flush();
      })

      it('forwards received ETH to destination address', async () => {
        const balance = await web3.eth.getBalance(randomAccount.address);

        assert.equal(balance.valueOf(), transferAmount, transferAmount + " wasn't in the destination account");
      });
    })
  });

  describe('receive ERC20 token', () => {
    let tokenContract;

    beforeEach(async () => {
      tokenContract = await TestERC20Token.new();
      await tokenContract.transfer(instance.address, transferAmount);
    });

    it('stores received ERC20 tokens', async () => {
      const balance = await tokenContract.balanceOf(instance.address);

      assert.equal(balance.valueOf(), transferAmount, transferAmount + " wasn't in the Contract");
    });

    describe('flush ERC20 tokens', () => {
      beforeEach(async () => {
        await instance.flushTokens(tokenContract.address);
      });

      it('forwards tokens to destination address', async () => {
        const balance = await tokenContract.balanceOf(randomAccount.address);

        assert.equal(balance.valueOf(), transferAmount, transferAmount + " wasn't in the destination account");
      });
    });
  });
});
