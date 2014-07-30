require 'rails_helper'

describe CalculatorController do

  context '#update' do
    let(:user) do
      User.create({:email =>'dhansiddh@gmail.com',:password => '12345678'})
    end
    before(:each) do
      sign_in user
    end
    it 'should do addition' do
      put :update, :command => "add 5"
      expect(Calculator.find_by_user_id(user.id).state).to eq(5.0)
      #expect(response).to render_template(:partial => 'calculator/_command_form')
      #expect(response.body).to match /Result is 5.0/m
    end

    it "should reset the value to 0" do
      put :update, :command =>"reset"
      expect(response.status).to eq(200)

    end
    it "should add 5 and multipy 3" do
      put :update, :command =>"add 5"
      put :update, :command =>"mul 3"
      expect(user.calculator.state).to eq(15)
      #expect(response.body).to eq("15.0")
    end
  end

end
