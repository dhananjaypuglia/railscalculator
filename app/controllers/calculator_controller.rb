class CalculatorController < ApplicationController

  def update
    if current_user
      unless current_user.calculator
        Calculator.create({:state => 0, :user_id => current_user.id})
      else
        calculator = current_user.calculator
        parser = Parser.new(calculator)
        parser.perform_operation(params[:command]) unless params[:command].nil?
        @state = calculator.state
      end
    else
      head 401
    end
  end

end