class Calculator < ActiveRecord::Base
  belongs_to :user

  def initialize_state
    self.state =0 if self.state.nil?
  end

  def + value
    self.state += value
    self.save
  end

  def - value
    self.state -= value
    self.save
  end

  def * value
    self.state *= value
    self.save
  end

  def / value
      if(value != 0)
        self.state /= value
        self.state.round(2)
        self.save
      else
        return "can not divide by zero"
      end
  end

  def reset
    self.state = 0
    self.save
  end


end
