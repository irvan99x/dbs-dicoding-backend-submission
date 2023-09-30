const NewThread = require('../NewThread');

describe('a NewThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      title: 'thread title',
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 123,
      body: true,
    };

    // Action and Assert
    expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create UserThread entities correctly', () => {
    // Arrange
    const payload = {
      title: 'thread title',
      body: 'thread body',
    };

    // Action
    const thread = new NewThread(payload);

    // Assert
    expect(thread).toBeInstanceOf(NewThread);
    expect(thread.title).toEqual(payload.title);
    expect(thread.body).toEqual(payload.body);
  });
});
